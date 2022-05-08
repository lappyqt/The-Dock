import { AppBar } from './appBar.js';

const appBarContainer = document.getElementById("app-bar");
const appBar = new AppBar(appBarContainer);

window.onload = () => {
    appBar.createAppList();
};

window.onbeforeunload = () => {
    appBar.saveAppList();
};