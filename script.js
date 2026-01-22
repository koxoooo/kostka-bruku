// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#3dff3d', '#00d4ff', '#b624ff'];
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p1.color;
                    this.ctx.globalAlpha = (1 - distance / 150) * 0.3;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== COBBLESTONE CURSOR FOLLOWER =====
class CobbleCursor {
    constructor() {
        this.cursor = document.getElementById('cobblestone-cursor');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isMoving = false;
        this.timeout = null;
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.animate();
    }
    
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.cursor.style.opacity = '1';
        this.isMoving = true;
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.isMoving = false;
            setTimeout(() => {
                if (!this.isMoving) {
                    this.cursor.style.opacity = '0';
                }
            }, 2000);
        }, 100);
    }
    
    animate() {
        // Smooth following
        const speed = 0.15;
        this.cursorX += (this.mouseX - this.cursorX) * speed;
        this.cursorY += (this.mouseY - this.cursorY) * speed;
        
        this.cursor.style.left = `${this.cursorX}px`;
        this.cursor.style.top = `${this.cursorY}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== COPY IP FUNCTIONALITY =====
class CopyIPHandler {
    constructor() {
        this.button = document.getElementById('copy-ip');
        this.feedback = document.getElementById('copy-feedback');
        this.ipText = 'wkrótce';
        
        this.button.addEventListener('click', () => this.copyToClipboard());
    }
    
    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.ipText);
            this.showFeedback();
            this.animateButton();
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.ipText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showFeedback();
                this.animateButton();
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            
            document.body.removeChild(textArea);
        }
    }
    
    showFeedback() {
        this.feedback.classList.add('show');
        setTimeout(() => {
            this.feedback.classList.remove('show');
        }, 2000);
    }
    
    animateButton() {
        this.button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 200);
    }
}

// ===== RULES MODAL =====
class RulesModal {
    constructor() {
        this.modal = document.getElementById('rules-modal');
        this.openButton = document.getElementById('show-rules');
        this.closeButton = document.getElementById('close-modal');
        this.overlay = this.modal.querySelector('.modal-overlay');
        
        this.openButton.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset animations for rule items
        const ruleItems = this.modal.querySelectorAll('.rule-item');
        ruleItems.forEach(item => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = '';
            }, 10);
        });
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== SMOOTH SCROLL REVEAL =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.info-card');
        this.observe();
    }
    
    observe() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, options);
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// ===== INTERACTIVE HOVER EFFECTS =====
class InteractiveEffects {
    constructor() {
        this.cards = document.querySelectorAll('.info-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            translateY(-10px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    }
    
    handleMouseLeave(card) {
        card.style.transform = '';
    }
}

// ===== LOGO TILT EFFECT =====
class LogoTilt {
    constructor() {
        this.logo = document.querySelector('.logo');
        if (this.logo) {
            this.logo.addEventListener('mousemove', (e) => this.tilt(e));
            this.logo.addEventListener('mouseleave', () => this.reset());
        }
    }
    
    tilt(e) {
        const rect = this.logo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.logo.style.transform = `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale(1.1)
        `;
    }
    
    reset() {
        this.logo.style.transform = '';
    }
}

// ===== ANIMATED TITLE =====
class AnimatedTitle {
    constructor() {
        this.titleWords = document.querySelectorAll('.title-word');
        this.animateWords();
    }
    
    animateWords() {
        this.titleWords.forEach((word, index) => {
            word.addEventListener('mouseenter', () => {
                word.style.transform = 'scale(1.1) rotate(-5deg)';
                word.style.filter = 'drop-shadow(0 0 20px currentColor)';
            });
            
            word.addEventListener('mouseleave', () => {
                word.style.transform = '';
                word.style.filter = '';
            });
        });
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ParticleSystem();
    new CobbleCursor();
    new CopyIPHandler();
    new RulesModal();
    new ScrollReveal();
    new InteractiveEffects();
    new LogoTilt();
    new AnimatedTitle();
    
    // Add loaded class to body for entrance animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });
    
    function activateEasterEgg() {
        // Create explosion of cobblestones
        for (let i = 0; i < 30; i++) {
            createCobblestoneExplosion();
        }
    }
    
    function createCobblestoneExplosion() {
        const cobble = document.createElement('div');
        cobble.style.position = 'fixed';
        cobble.style.width = '30px';
        cobble.style.height = '30px';
        cobble.style.left = '50%';
        cobble.style.top = '50%';
        cobble.style.background = 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect fill="%23808080" width="16" height="16"/><rect fill="%23696969" x="0" y="0" width="8" height="8"/><rect fill="%23696969" x="8" y="8" width="8" height="8"/><rect fill="%23505050" x="2" y="2" width="4" height="4"/><rect fill="%23505050" x="10" y="10" width="4" height="4"/></svg>\') center/cover';
        cobble.style.pointerEvents = 'none';
        cobble.style.zIndex = '10000';
        cobble.style.transition = 'all 2s ease-out';
        
        document.body.appendChild(cobble);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 300 + 200;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        const rotation = Math.random() * 720 - 360;
        
        setTimeout(() => {
            cobble.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            cobble.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            cobble.remove();
        }, 2000);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce particle count on mobile
if (window.innerWidth < 768) {
    const particleCanvas = document.getElementById('particles');
    if (particleCanvas) {
        particleCanvas.style.opacity = '0.5';
    }
}

// Preload logo for smooth animations
const logoImg = document.querySelector('.logo');
if (logoImg && !logoImg.complete) {
    logoImg.addEventListener('load', () => {
        logoImg.classList.add('loaded');
    });
}
