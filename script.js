document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.getElementById('hamburger');
    const navMain = document.querySelector('.nav-main');

    if (hamburger && navMain) {
        hamburger.addEventListener('click', () => {
            navMain.classList.toggle('is-active');
        });
    }


    // --- Strabismus Test Page Specific Logic ---
    // This ensures the test code only runs on test.html
    const testContainer = document.getElementById('test-container');
    if (testContainer) {
    
        let allowDotPlacement = false; // Start with test paused until user starts it

        const cursorDot = document.getElementById('cursor-dot');
        const popup = document.getElementById('popup');
        const infoPopup = document.getElementById('info-popup');

        function moveCursorDot(e) {
            if (cursorDot) {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
            }
        }

        function placeGreenDot(e) {
            // Only place dot if test is active (popups are closed) and allowed
            if (popup.style.display !== 'flex' && infoPopup.style.display !== 'flex' && allowDotPlacement) {
                const newDot = document.createElement('div');
                newDot.style.position = 'absolute';
                newDot.style.width = '10px';
                newDot.style.height = '10px';
                newDot.style.backgroundColor = document.getElementById('right-eye-color').value;
                newDot.style.borderRadius = '50%';
                newDot.style.left = (e.clientX - testContainer.offsetLeft) + 'px';
                newDot.style.top = (e.clientY - testContainer.offsetTop) + 'px';
                newDot.style.transform = 'translate(-50%, -50%)';
                newDot.style.zIndex = '5';
                testContainer.appendChild(newDot);
            }
        }

        function updateCrossAndDotColors() {
            const leftEyeColor = document.getElementById('left-eye-color').value;
            const rightEyeColor = document.getElementById('right-eye-color').value;
            
            document.querySelectorAll('.cross').forEach(cross => {
                cross.style.setProperty('--cross-color', leftEyeColor);
            });
            
            const styleId = 'cross-color-style';
            let styleElement = document.getElementById(styleId);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            styleElement.innerHTML = `.cross:before, .cross:after { background-color: ${leftEyeColor}; }`;
            
            if (cursorDot) {
                 cursorDot.style.backgroundColor = rightEyeColor;
            }
        }

        // --- Event Listeners for the Test ---
        document.addEventListener('mousemove', moveCursorDot);
        testContainer.addEventListener('click', placeGreenDot);

        document.getElementById('reset-button').addEventListener('click', function() {
            const dots = testContainer.querySelectorAll('div:not(.cross):not(#cursor-dot):not(.test-controls)');
            dots.forEach(dot => dot.remove());
        });

        document.getElementById('close-popup-button').addEventListener('click', function() {
            popup.style.display = 'none';
            updateCrossAndDotColors();
            document.getElementById('reset-button').click();
            testContainer.style.cursor = 'none';
            allowDotPlacement = true;
        });
        
        document.getElementById('open-popup-button').addEventListener('click', function() {
            popup.style.display = 'flex';
            testContainer.style.cursor = 'default';
            allowDotPlacement = false;
        });

        document.getElementById('open-info-button').addEventListener('click', function() {
            infoPopup.style.display = 'flex';
            testContainer.style.cursor = 'default';
            allowDotPlacement = false;
        });

        document.getElementById('close-info-popup-button').addEventListener('click', function() {
            infoPopup.style.display = 'none';
            testContainer.style.cursor = 'none';
            // Only allow dot placement if the main settings popup is also closed
            if (popup.style.display !== 'flex') {
                 allowDotPlacement = true;
            }
        });
        
        // --- Language Switching Functionality ---
        const langButtons = document.querySelectorAll('.language-buttons button');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.id.split('-')[0];
                switchLanguage(lang);
            });
        });
        
        function switchLanguage(language) {
            document.querySelectorAll('[data-en]').forEach(element => {
                const text = element.getAttribute(`data-${language}`);
                if (text) {
                    // Use innerHTML to correctly render tags like <strong>
                    element.innerHTML = text;
                }
            });
        }
        
        // --- Initial Setup for Test Page ---
        // Show info popup on first visit to explain the test
        if (!sessionStorage.getItem('infoPopupShown')) {
            infoPopup.style.display = 'flex';
            testContainer.style.cursor = 'default';
            allowDotPlacement = false;
            sessionStorage.setItem('infoPopupShown', 'true');
        } else {
             // If not first visit, open the main settings popup
            popup.style.display = 'flex';
            testContainer.style.cursor = 'default';
            allowDotPlacement = false;
        }

        // Set default language
        switchLanguage('de');
    }
});
