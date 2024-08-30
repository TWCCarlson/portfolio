class Resume extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles for the shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume.css';
        link.type = 'text/css';

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'resume-body');
        const resumeSlot = document.createElement('slot');
        wrapper.appendChild(resumeSlot);

        this.shadowRoot.appendChild(wrapper);
        this.shadowRoot.append(link);
    }
}
customElements.define('resume-body', Resume);