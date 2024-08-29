class ResumeLine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-line-style.css';
        link.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-wrapper');

        // Pop-up trigger element
        this.trigger = document.createElement('div');
        this.trigger.setAttribute('class', 'resume-line');
        this.trigger.defaultContent = "Default resume line text.";
        this.expandedState = false;
        
        // Create the content element
        this.content = document.createElement('div');
        this.content.setAttribute('class', 'resume-line-expanded');

        this.detailSlot = document.createElement('slot');
        this.content.appendChild(this.detailSlot);

        // Build the structure of the tree
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.content);
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(link);
    }

    connectedCallback() {
        // this.trigger.textContent = this.getAttribute('line-text') || this.trigger.defaultContent;
        const lineBullet = document.createElement('div');
        lineBullet.setAttribute('class', 'resume-line-bullet');
        lineBullet.textContent = "•";
        this.trigger.appendChild(lineBullet)
        this.lineText = document.createElement('div');
        this.lineText.textContent = this.getAttribute('line-text') || this.trigger.defaultContent; 
        this.trigger.appendChild(this.lineText);

        // Hide the expanded stuff at first
        this.content.style.display = 'none';

        // The glow should only happen if there is something in the slot to view
        this.detailSlot.addEventListener('slotchange', () => {
            const assignedNodes = this.detailSlot.assignedElements();
            if (assignedNodes.length > 0) {
                this._initEvents(this.trigger, this.content);
            }
        });
    }

    _initEvents(trigger, content) {
        trigger.addEventListener('click', () => this._toggleContent(content));
        this.wrapper.addEventListener('mouseover', () => this._glowTrigger(this.wrapper));
        this.wrapper.addEventListener('mouseout', () => this._resetTrigger(this.wrapper));
        content.addEventListener('click', () => this._toggleContent(content));
    }

    _toggleContent(content) {
        this.expandedState = content.style.display=='block' ? false : true;
        content.style.display = this.expandedState==false ? 'none' : 'block';
    }

    _glowTrigger(element) {
        element.classList.add('resume-line-hovered');
    }

    _resetTrigger(element) {
        element.classList.remove('resume-line-hovered');
    }
}
customElements.define('resume-line', ResumeLine);


class ResumeLineDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-line-style.css';
        link.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-detail-wrapper');

        // Build the shadow DOM
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(link)
    }

    connectedCallback() {
        // Text content of the line details
        const content = document.createElement('div');
        content.setAttribute('class', 'resume-line-expanded');
        content.defaultContent = "This is an explanation of my role at Company."
        content.textContent = this.getAttribute('detail-text') || content.defaultContent;
        this.wrapper.appendChild(content);

        // Embedded video
        const videoURL = this.getAttribute('video-url');
        if (videoURL) {
            const videoEmbed = document.createElement('div');
            videoEmbed.setAttribute('class', 'resume-line-detail-video')
            this.wrapper.appendChild(videoEmbed);
            let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            let match = videoURL.match(regExp);
            if (match && match[2].length == 11) {
                videoEmbed.innerHTML = '<iframe width="560" height="315" \
                                        src="https://www.youtube.com/embed/'
                                        + match[2] 
                                        + '" frameborder="0" allowfullscreen></iframe>';
            } else {
                return 'error';
            }
        }
        
        // Read more style link to another page on the site
        const articleURL = this.getAttribute('article-url');
        if (articleURL) {
            // Container
            const urlContainer = document.createElement('div');
            urlContainer.style.textAlign = 'right';
            this.wrapper.appendChild(urlContainer);
            // Hyperlink
            const readMore = document.createElement('a');
            readMore.href = articleURL;
            readMore.innerHTML = "Read More >>";
            readMore.setAttribute('class', 'resume-line-detail-readmore');
            urlContainer.appendChild(readMore)
        }
    }
}
customElements.define('resume-line-detail', ResumeLineDetail)