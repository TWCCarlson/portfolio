class ResumePreamble extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const elementStyleLink = document.createElement('link');
        elementStyleLink.rel = 'stylesheet';
        elementStyleLink.href = './styles/resume-preamble-style.css';
        elementStyleLink.type = 'text/css';
        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/root-styles.css';
        rootStyleLink.type = 'text/css';

        // Container for the 'button'
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('resume-preamble');

        // > clue for users
        const foldIndicator = document.createElement('span');
        this.wrapper.appendChild(foldIndicator);

        // Hold passed text element
        const textContainer = document.createElement('slot');
        this.wrapper.appendChild(textContainer);

        // Build the DOM
        this.shadowRoot.append(this.wrapper);
        this.shadowRoot.append(elementStyleLink, rootStyleLink);

        // Resume starts hidden
        this.resumeRevealed = false;
    }

    connectedCallback() {
        // Events to reveal the rest of the resume
        this.wrapper.addEventListener('click', () => {
            if (!this.resumeRevealed) {
                this.resumeRevealed = true;

                // Transition timings
                const resumeBodyRevealTime = 2.5;
                const preambleShrinkTime = 1;
                const preambleVanishTime = 0.5;

                // Reveal the resume body
                const resumeBodyWrapper = document.querySelector('resume-body');
                const resumeShadow = resumeBodyWrapper.shadowRoot
                const resumeBody = resumeShadow.querySelector('.resume-body');
                resumeBody.style.transition = `height ${resumeBodyRevealTime}s ease-out`;
                resumeBody.style.height = resumeBody.scrollHeight + 'px';

                // Then hide the preamble
                setTimeout(() => {
                    // Shrink
                    this.wrapper.style.transition = `max-height ${preambleShrinkTime}s ease-out,
                                                     padding ${preambleShrinkTime}s ease-out`;
                    this.wrapper.classList.add('minimize');

                    // Fade
                    setTimeout(() => {
                        this.wrapper.style.transition = `opacity ${preambleVanishTime}s ease-out`
                        this.wrapper.classList.add('vanish');
                    }, preambleShrinkTime * 1000);
                }, (resumeBodyRevealTime-1.5) * 1000);
            }
        })
    }
}
customElements.define('resume-preamble', ResumePreamble);


class ResumePreambleButton extends HTMLElement {
    constructor() {
        super();
        
        // Import styles to the shadow DOM
        const elementStyleLink = document.createElement('link');
        elementStyleLink.rel = 'stylesheet';
        elementStyleLink.href = './styles/resume-preamble-style.css';
        elementStyleLink.type = 'text/css';
        const lineStyleLink = document.createElement('link');
        lineStyleLink.rel = 'stylesheet';
        lineStyleLink.href = './styles/resume-line-style.css';
        lineStyleLink.type = 'text/css';
        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/root-styles.css';
        rootStyleLink.type = 'text/css';

        // Button content includes the rotating character
        // Create the line's content
        const bulletDepth = 0;
        const depthCharMap = {
            "0": [">", "0.5em", "0.5em"],
            "1": ["•", "0.5em", "0em"],
            "2": ["•", "0.5em", "1em"]
        } /* ◦ */

        // Create bullet indent
        const bulletIndent = document.createElement('span');
        bulletIndent.style.width = depthCharMap[bulletDepth][2];
        bulletIndent.setAttribute('class', 'resume-line-bullet');
        bulletIndent.style.display = 'inline-block';
        this.appendChild(bulletIndent);

        // Create a bullet element
        const lineBulletContainer = document.createElement('span');
        lineBulletContainer.setAttribute('class', 'resume-line-bullet');
        lineBulletContainer.style.display = 'inline-block';
        this.appendChild(lineBulletContainer);

        // Bullet itself rotates and needs its own element to do so in-place
        const lineBullet = document.createElement('span');
        lineBullet.setAttribute('class', 'resume-line-bullet-char');
        lineBullet.innerHTML = depthCharMap[bulletDepth][0];
        lineBullet.style.display = 'inline-block';
        lineBulletContainer.appendChild(lineBullet);

        // Create space between text and bullet
        const bulletPad = document.createElement('span');
        bulletPad.style.width = depthCharMap[bulletDepth][1];
        bulletPad.setAttribute('class', 'resume-line-bullet');
        bulletPad.style.display = 'inline-block';
        this.appendChild(bulletPad);

        // Text
        const buttonText = document.createElement('span');
        buttonText.innerHTML = "Tap to see more";
        this.appendChild(buttonText);

        this.setAttribute('class', 'resume-preamble-button');

        this.append(elementStyleLink, lineStyleLink, rootStyleLink);
    }
}
customElements.define('resume-preamble-button', ResumePreambleButton);