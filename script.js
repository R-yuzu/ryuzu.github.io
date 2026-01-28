// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticleBackground();
    
    // 初始化所有交互功能
    initSmoothScrolling();
    initBackToTop();
    initButtonInteractions();
    initScrollAnimations();
    initFormInteractions();
    initMenuToggle();
    
    // 设置动态标题
    document.title = "炫动空间 | " + getTimeBasedGreeting();
});

// 粒子背景系统
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, 
                              ${Math.floor(Math.random() * 100 + 100)}, 
                              ${Math.floor(Math.random() * 255)}, 
                              ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界反弹
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // 创建粒子
    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制连接线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 99, 255, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制所有粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 绘制连接线
        drawLines();
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// 平滑滚动
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // 更新活动导航项
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
}

// 回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 按钮交互
function initButtonInteractions() {
    // 自定义按钮交互
    const customButtons = document.querySelectorAll('.custom-btn');
    const addButton = document.getElementById('add-new-btn');
    const urlInputContainer = document.getElementById('url-input-container');
    
    // 自定义按钮点击事件
    customButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            } else if (this.id !== 'add-new-btn') {
                showNotification('请先设置此按钮的跳转链接', 'info');
            }
        });
    });
    
    // 添加新按钮功能
    addButton.addEventListener('click', function() {
        urlInputContainer.style.display = 'flex';
        urlInputContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 保存URL设置
    const saveUrlBtn = document.getElementById('save-url');
    saveUrlBtn.addEventListener('click', function() {
        const url = document.getElementById('new-url').value;
        const btnText = document.getElementById('new-btn-text').value;
        
        if (url && btnText) {
            // 创建新按钮
            const newButton = document.createElement('button');
            newButton.className = 'custom-btn';
            newButton.setAttribute('data-url', url);
            newButton.innerHTML = `<span>${btnText}</span> <i class="fas fa-external-link-alt"></i>`;
            
            // 添加到按钮区域
            const placeholderButtons = document.querySelector('.placeholder-buttons');
            placeholderButtons.insertBefore(newButton, addButton);
            
            // 重新绑定事件
            newButton.addEventListener('click', function() {
                window.open(url, '_blank');
            });
            
            // 清空输入框并隐藏
            document.getElementById('new-url').value = '';
            document.getElementById('new-btn-text').value = '';
            urlInputContainer.style.display = 'none';
            
            showNotification('新按钮已添加成功！', 'success');
        } else {
            showNotification('请填写完整的网址和按钮文字', 'error');
        }
    });
    
    // 传送门按钮悬停效果增强
    const portalButtons = document.querySelectorAll('.portal-btn');
    portalButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.glow-card, .portal-btn, .section-title');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 初始设置
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // 初始检查
}

// 表单交互
function initFormInteractions() {
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const emailInput = document.querySelector('.subscribe-form input[type="email"]');
    
    subscribeBtn.addEventListener('click', function() {
        const email = emailInput.value;
        
        if (validateEmail(email)) {
            // 模拟订阅成功
            emailInput.value = '';
            showNotification('订阅成功！感谢加入空间探索', 'success');
        } else {
            showNotification('请输入有效的电子邮箱地址', 'error');
            emailInput.focus();
        }
    });
    
    // 邮箱验证函数
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// 移动端菜单切换
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(10, 10, 20, 0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.backdropFilter = 'blur(10px)';
            }
        });
        
        // 点击导航链接后关闭菜单（移动端）
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // 添加通知样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: rgba(10, 10, 20, 0.9);
                border-left: 4px solid #6C63FF;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 1rem;
                color: white;
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success { border-left-color: #4ECDC4; }
            .notification.error { border-left-color: #FF6B9D; }
            .notification.info { border-left-color: #6C63FF; }
        `;
        document.head.appendChild(style);
    }
}

// 根据时间生成问候语
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 5) return "深夜模式";
    if (hour < 12) return "清晨模式";
    if (hour < 14) return "午间模式";
    if (hour < 18) return "下午模式";
    if (hour < 22) return "夜晚模式";
    return "深夜模式";
}

// 添加视差滚动效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // 动态更新导航栏透明度
    const nav = document.querySelector('.glass-nav');
    if (scrolled > 100) {
        nav.style.background = 'rgba(10, 10, 20, 0.9)';
        nav.style.backdropFilter = 'blur(15px)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.backdropFilter = 'blur(12px)';
    }
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Alt + 1: 回到顶部
    if (e.altKey && e.key === '1') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Alt + 2: 滚动到传送门区域
    if (e.altKey && e.key === '2') {
        const portalSection = document.getElementById('projects');
        if (portalSection) {
            portalSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Alt + H: 显示帮助提示
    if (e.altKey && e.key.toLowerCase() === 'h') {
        showNotification('快捷键: Alt+1(顶部) | Alt+2(传送门) | Alt+H(帮助)', 'info');
    }
});

// 页面加载完成后的初始动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        // 显示欢迎消息
        setTimeout(() => {
            showNotification('欢迎来到炫动空间！试试鼠标悬停效果和滚动动画', 'info');
        }, 1000);
    }, 300);
});