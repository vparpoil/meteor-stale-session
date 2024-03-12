Package.describe({
  name:    'zuuk:stale-session',
  summary: 'Stale session and session timeout handling for meteorjs',
  git:     "https://github.com/lindleycb/meteor-stale-session.git",
  version: "1.1.0"
});

Package.onUse(function(api) {
    api.versionsFrom(['2.8.0', "3.0-beta.0"])
    api.use('accounts-base@2.2.4 || 3.0.0-beta300.0', ['client','server']);
    api.use('tracker', 'client');
    api.use('jquery@1.0.0', 'client');
    api.addFiles('client.js', 'client');
    api.addFiles('server.js', 'server');
});
