//
// Server side activity detection for the session timeout
//
// Meteor settings:
// - staleSessionInactivityTimeout: the amount of time (in ms) after which, if no activity is noticed, a session will be considered stale
// - staleSessionPurgeInterval: interval (in ms) at which stale sessions are purged i.e. found and forcibly logged out
// - staleSessionForceLogout: whether or not we want to force log out and purge stale sessions
//
const staleSessionPurgeInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionPurgeInterval || (1*60*1000); // 1min
const inactivityTimeout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionInactivityTimeout || (30*60*1000); // 30mins
const forceLogout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionForceLogout;

//
// provide a user activity heartbeat method which stamps the user record with a timestamp of the last
// received activity heartbeat.
//
Meteor.methods({
    heartbeat: async function(options) {
        if (!this.userId) { return; }
        const user = await Meteor.users.findOneAsync(this.userId);
        if (user) {
            await Meteor.users.updateAsync(user._id, {$set: {heartbeat: new Date()}});
        }
    }
});


//
// periodically purge any stale sessions, removing their login tokens and clearing out the stale heartbeat.
//
if (forceLogout !== false) {
    Meteor.setInterval(async function() {
        const now = new Date(), overdueTimestamp = new Date(now-inactivityTimeout);
        await Meteor.users.updateAsync({heartbeat: {$lt: overdueTimestamp}},
                            {$set: {'services.resume.loginTokens': []},
                             $unset: {heartbeat:1}},
                            {multi: true});
    }, staleSessionPurgeInterval);
}
