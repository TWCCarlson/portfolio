import { elementTogglesContent } from "../shared-modules/toggle-container.js";

class ResumeLine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.style.backgroundColor = 'transparent';

        // Import styles to the shadow DOM
        const elementStyleLink = document.createElement('link');
        elementStyleLink.rel = 'stylesheet';
        elementStyleLink.href = './styles/resume-line-style.css';
        elementStyleLink.type = 'text/css';
        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/root-styles.css';
        rootStyleLink.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-wrapper');
        const passedClasses = this.getAttribute('wrapper-class');
        this.wrapper.classList.add(passedClasses);

        // Pop-up trigger element
        this.trigger = document.createElement('div');
        this.trigger.setAttribute('class', 'resume-line');
        this.trigger.defaultContent = "Default resume line text.";
        
        // Create the content element
        this.content = document.createElement('div');
        this.content.setAttribute('class', 'resume-line-container');
        
        // Prepare to load content into the slot
        this.detailSlot = document.createElement('slot');
        this.detailSlotFilled = false;
        this.content.appendChild(this.detailSlot);
        
        // Build the structure of the tree
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.content);
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(elementStyleLink);
        this.shadowRoot.appendChild(rootStyleLink);

        const spacer = document.createElement('div');
        spacer.setAttribute('class', 'resume-line-spacer');
        this.shadowRoot.appendChild(spacer)
    }

    connectedCallback() {
        // Create the line's content
        const bulletDepth = this.getAttribute('indent-depth');
        const depthCharMap = {
            "0": ["", "0em", "0em"],
            "1": ["•", "0.5em", "0em"],
            "2": ["•", "0.5em", "1em"]
        } /* ◦ */

        // Create bullet indent
        const bulletIndent = document.createElement('div');
        bulletIndent.style.width = depthCharMap[bulletDepth][2];
        bulletIndent.setAttribute('class', 'resume-line-bullet');
        this.trigger.appendChild(bulletIndent);

        // Create a bullet element
        this.lineBulletContainer = document.createElement('div');
        this.lineBulletContainer.setAttribute('class', 'resume-line-bullet');
        this.trigger.appendChild(this.lineBulletContainer);

        // Bullet itself rotates and needs its own element to do so in-place
        this.lineBullet = document.createElement('div');
        this.lineBullet.setAttribute('class', 'resume-line-bullet-char');
        this.lineBullet.innerHTML = depthCharMap[bulletDepth][0];
        this.lineBulletContainer.appendChild(this.lineBullet);

        // Create space between text and bullet
        const bulletPad = document.createElement('div');
        bulletPad.style.width = depthCharMap[bulletDepth][1];
        bulletPad.setAttribute('class', 'resume-line-bullet');
        this.trigger.appendChild(bulletPad);
        
        // If a header is requested, create it
        const headerText = this.getAttribute('line-header')
        this.lineHeader = document.createElement('div');
        if (headerText) {
            this.lineHeader.setAttribute('class', 'resume-line-header')
            this.lineHeader.innerHTML = headerText;
            this.trigger.appendChild(this.lineHeader);
        }
        
        // Create the line text
        const lineText = this.getAttribute('line-text');
        this.lineText = document.createElement('div');
        if (this.lineText) {
            // this.lineText.setAttribute('class', 'resume-line');
            // for some reason I dont use this but it works so lol
            this.lineText.innerHTML = lineText;
            this.trigger.appendChild(this.lineText);
        }
        
        // If a tail is requested, create it
        const tailText = this.getAttribute('line-tail')
        this.linetail = document.createElement('div');
        if (tailText) {
            this.linetail.setAttribute('class', 'resume-line-tail')
            this.linetail.innerHTML = tailText;
            this.trigger.appendChild(this.linetail);
        }
        
        // Check if custom style is requested
        const textFontSizeOverride = this.getAttribute('font-size');
        if (textFontSizeOverride) {
            let textFontSizeOverride_css = `var(--resume-${textFontSizeOverride}-fs)`;
            this.lineHeader.style.fontSize = textFontSizeOverride_css;
            this.lineText.style.fontSize = textFontSizeOverride_css;
            this.linetail.style.fontSize = textFontSizeOverride_css;
            
        }

        // Implement interactivity if there is slot content
        const assignedNodes = this.detailSlot.assignedNodes().filter(node => {
            return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        })
        this.detailSlot.addEventListener('slotchange', () => {
            if (!this.detailSlotFilled && !(assignedNodes.length === 0)) {
                this.detailSlotFilled = true;
                this.content.setAttribute('class', 'resume-line-content');
                // If content is added to the slot, make it clickable to unfold
                elementTogglesContent(this.wrapper, this.trigger, this.content);
                // this.wrapper.appendChild(contentWrapper);

                // Update the line bullet
                this.lineBullet.innerHTML = ">";
                this.lineBullet.style.fontWeight = 'bold';
                this.lineBullet.style.color = "var(--interactable)";
                this.lineBullet.style.width = "0.5em";
                bulletPad.style.width = "0.5em";
            }
        });
    }
}
customElements.define('resume-line', ResumeLine);


class ResumeLineDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/resume-line-style.css';
        rootStyleLink.type = 'text/css';
        const elementStyleLink = document.createElement('link');
        elementStyleLink.rel = 'stylesheet';
        elementStyleLink.href = './styles/root-styles.css';
        elementStyleLink.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-detail-wrapper');

        // Build the shadow DOM
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(rootStyleLink);
        this.shadowRoot.appendChild(elementStyleLink);
    }

    connectedCallback() {
        // Text content of the line details
        const text = this.getAttribute('detail-text');
        if (text) {
            const textContainer = document.createElement('div');
            textContainer.setAttribute('class', 'resume-line-detail-text');
            textContainer.innerHTML = text;
            this.wrapper.appendChild(textContainer);
        }

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
        
        // Image
        const imageURL = this.getAttribute('image-url');
        if (imageURL) {
            // Container
            const imContainer = document.createElement('img');
            imContainer.src=imageURL;
            imContainer.setAttribute('class', 'resume-line-detail-image')
            this.wrapper.appendChild(imContainer);
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