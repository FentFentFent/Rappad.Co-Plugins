

function enabled() {
if (localStorage.getItem('dashboard-rap-limit') === '9999999999999') return;
localStorage.setItem('old-dashboard-rap-limit', localStorage.getItem('dashboard-rap-limit'));
localStorage.setItem('dashboard-rap-limit', '9999999999999');
}
function disabled() {
localStorage.setItem('dashboard-rap-limit', localStorage.getItem('old-dashboard-rap-limit') || '25');
localStorage.removeItem('old-dashboard-rap-limit');
}
addon.onToggled = (t) => {
(t ? enabled : disabled)();
}
