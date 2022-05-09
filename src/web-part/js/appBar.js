const { ipcRenderer } = require('electron');


export class AppBar {
    constructor(container) {
        this.container = container;
        this.#allowDragAndDrop();
    }

    #openApp(path) {
        ipcRenderer.invoke('openApp', path);
    }

    #extractIcon(path) {
        ipcRenderer.invoke('extractIcon', path);
    }

    #allowDragAndDrop() {
        document.ondrop = (event) => event.preventDefault();
        document.ondragenter = (event) => event.preventDefault();
        document.ondragleave = (event) => event.preventDefault();
        document.ondragover = (event) => event.preventDefault();

        this.container.ondragover = (event) => {
            event.stopPropagation();
            event.preventDefault();
        }
        
        this.container.ondrop = (event) => {
            event.stopPropagation();
            event.preventDefault();

            this.#extractIcon(event.dataTransfer.files[0].path);

            this.#addApp(
                event.dataTransfer.files[0].name.replace('.exe', '').toLowerCase(),
                event.dataTransfer.files[0].path);
        }
    }

    #addApp(name, path) {
        const app = document.createElement('li');
        app.onmousedown = () => this.#openApp(path);
        app.setAttribute('path', path);
        app.setAttribute('title', name);

        const appIcon = document.createElement('img');

        setTimeout(() => {
            appIcon.src = `file:///${process.cwd()}\\src\\icons\\${name}.png`;
            app.append(appIcon);

            this.container.appendChild(app);
        }, 450);
    }

    #recoverApp(name, path) {
        const app = document.createElement('li');
        app.onmousedown = () => this.#openApp(path);
        app.setAttribute('path', path);
        app.setAttribute('title', name);

        const appIcon = document.createElement('img');
        appIcon.src = `file:///${process.cwd()}\\src\\icons\\${name}.png`;
        app.append(appIcon);

        this.container.appendChild(app);
    }

    createAppList() {
        const appData = JSON.parse(localStorage.getItem('app-data'));

        for (let i = 0; i < appData.length; i++) {
            this.#recoverApp(appData[i].name, appData[i].path);
        }
    }

    saveAppList() {
        let apps = [];

        for (let item of this.container.children) {
            let appData = {
                name: item.title,
                path: item.getAttribute('path')
            };

            apps.push(appData);
        }

        localStorage.setItem('app-data', JSON.stringify(apps));
    }
}