class SDOApp {
    constructor() {
        this.studentId = 'BR001';
        this.init().catch(error => {
            console.error('Ошибка инициализации:', error);
        });
    }

    async init() {
        console.log('Инициализация приложения...');
        await this.loadStudentData();
        await this.loadCourses();
        await this.loadAnalytics();
        await this.loadNotifications();
        this.initializeEventListeners();
        console.log('Приложение инициализировано');
    }

    async loadStudentData() {
        try {
            console.log('Загружаю данные студента...');
            const response = await fetch(`/api/students/${this.studentId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Данные студента:', result);
            
            if (result.success) {
                this.renderStudentData(result.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных студента:', error);
            document.getElementById('userName').textContent = 'Басыров Риналь';
            document.getElementById('userAvatar').textContent = 'БР';
        }
    }

    async loadCourses() {
        try {
            console.log('Загружаю курсы...');
            const response = await fetch('/api/courses');
            const result = await response.json();
            
            if (result.success) {
                this.renderCourses(result.data.courses);
            }
        } catch (error) {
            console.error('Ошибка загрузки курсов:', error);
        }
    }

    async loadAnalytics() {
        try {
            console.log('Загружаю аналитику...');
            const response = await fetch('/api/analytics/dashboard');
            const result = await response.json();
            
            if (result.success) {
                this.renderAnalytics(result.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
        }
    }

    async loadNotifications() {
        try {
            const notifications = await this.generateNotifications();
            this.renderNotifications(notifications);
        } catch (error) {
            console.error('Ошибка загрузки уведомлений:', error);
        }
    }

    generateNotifications() {
        const notifications = [
            {
                id: 1,
                title: "Новое задание",
                description: "Доступно новое задание по математическому анализу",
                time: this.getRelativeTime(2),
                icon: "fas fa-bell",
                type: "assignment",
                course: "Математический анализ"
            },
            {
                id: 2,
                title: "Завтра контрольная",
                description: "Контрольная работа по физике",
                time: this.getRelativeTime(5),
                icon: "fas fa-calendar",
                type: "exam",
                course: "Физика"
            },
            {
                id: 3,
                title: "Срок сдачи проекта",
                description: "Осталось 3 дня до сдачи проекта по программированию",
                time: this.getRelativeTime(24),
                icon: "fas fa-exclamation-triangle",
                type: "deadline",
                course: "Языки программирования"
            },
            {
                id: 4,
                title: "Новая оценка",
                description: "Опубликована оценка за лабораторную работу",
                time: this.getRelativeTime(48),
                icon: "fas fa-chart-line",
                type: "grade",
                course: "Информатика"
            }
        ];
        
        return Promise.resolve(notifications);
    }

    getRelativeTime(hoursAgo) {
        const now = new Date();
        const time = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        
        const diffMs = now - time;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) {
            return `${diffDays} ${this.getDaysLabel(diffDays)} назад`;
        } else if (diffHours > 0) {
            return `${diffHours} ${this.getHoursLabel(diffHours)} назад`;
        } else {
            return "Только что";
        }
    }

    getHoursLabel(hours) {
        if (hours === 1) return "час";
        if (hours >= 2 && hours <= 4) return "часа";
        return "часов";
    }

    getDaysLabel(days) {
        if (days === 1) return "день";
        if (days >= 2 && days <= 4) return "дня";
        return "дней";
    }

    renderStudentData(student) {
        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement && student.name) {
            userNameElement.textContent = student.name;
        }
        if (userAvatarElement && student.avatar) {
            userAvatarElement.textContent = student.avatar;
        }
    }

    renderCourses(courses) {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;

        if (courses && courses.length > 0) {
            coursesGrid.innerHTML = courses.map(course => this.createCourseCard(course)).join('');
            this.initializeFavoriteStars();
        }
    }

    createCourseCard(course) {
        const progressBars = this.generateProgressBars(course.progress);
        const groupProgress = this.calculateGroupProgress(course.progress);
        const groupBars = this.generateProgressBars(groupProgress);
        
        return `
            <div class="course-card" data-course="${course.name}">
                <div class="course-image">
                    <div>${course.shortName}</div>
                    <div class="course-badge">${course.status}</div>
                    <div class="favorite-star">★</div>
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.name} (2024/2025 модули: ${course.modules})</h3>
                    <div class="course-info">
                        <span class="course-instructor">${course.instructor}</span>
                        <span>${course.progress.toFixed(2)}% выполнено</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-header">
                            <span>Прогресс</span>
                            <span>${course.progress.toFixed(2)}%</span>
                        </div>
                        <div class="progress-divisions">
                            ${progressBars}
                        </div>
                    </div>
                    <div class="group-progress-container">
                        <div class="progress-header">
                            <span>Среднее по группе</span>
                            <span>${groupProgress.toFixed(2)}% (${(groupProgress/10).toFixed(2)}/10)</span>
                        </div>
                        <div class="progress-divisions group">
                            ${groupBars}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateProgressBars(progress) {
        const filledBars = Math.round(progress / 10);
        let bars = '';
        
        for (let i = 0; i < 10; i++) {
            const filledClass = i < filledBars ? 'filled' : '';
            bars += `<div class="division ${filledClass}"></div>`;
        }
        
        return bars;
    }

    calculateGroupProgress(studentProgress) {
        const variance = Math.random() * 20 - 10;
        const result = Math.max(0, Math.min(100, studentProgress + variance));
        return parseFloat(result.toFixed(2));
    }

    renderAnalytics(analytics) {
        this.updateMetric('loadValue', `${analytics.currentLoad}%`);
        this.updateMetric('progressValue', `${analytics.overallProgress}%`);
        this.updateMetric('attendanceValue', `${analytics.attendance}%`);
        this.updateMetric('deadlinesValue', analytics.deadlinesThisWeek);

        const loadProgress = document.getElementById('loadProgress');
        if (loadProgress) {
            loadProgress.style.width = `${analytics.currentLoad}%`;
        }
    }

    renderNotifications(notifications) {
        const notificationsList = document.getElementById('notificationsList');
        if (!notificationsList) return;

        if (notifications && notifications.length > 0) {
            notificationsList.innerHTML = notifications.map(notification => `
                <div class="notification-item" data-notification-id="${notification.id}">
                    <div class="notification-icon ${notification.type}">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-desc">${notification.description}</div>
                        <div class="notification-meta">
                            <span class="notification-course">${notification.course}</span>
                            <span class="notification-time">${notification.time}</span>
                        </div>
                    </div>
                    <button class="notification-close" onclick="window.sdoApp.closeNotification(${notification.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        } else {
            notificationsList.innerHTML = `
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">Нет уведомлений</div>
                        <div class="notification-desc">Здесь будут появляться новые уведомления</div>
                    </div>
                </div>
            `;
        }
    }

    closeNotification(notificationId) {
        const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
        if (notificationElement) {
            notificationElement.style.opacity = '0';
            setTimeout(() => {
                notificationElement.remove();
                this.checkEmptyNotifications();
            }, 300);
        }
    }

    checkEmptyNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        if (notificationsList && notificationsList.children.length === 0) {
            notificationsList.innerHTML = `
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">Все уведомления прочитаны</div>
                        <div class="notification-desc">Новых уведомлений нет</div>
                    </div>
                </div>
            `;
        }
    }

    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    initializeEventListeners() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> Обновление...';
            refreshBtn.disabled = true;
        }

        await this.loadStudentData();
        await this.loadCourses();
        await this.loadAnalytics();
        await this.loadNotifications();
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
            refreshBtn.disabled = false;
        }
        
        alert('Данные обновлены!');
    }

    initializeFavoriteStars() {
        let favoriteCourses = JSON.parse(localStorage.getItem('favoriteCourses')) || [];
        
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach((card) => {
            const courseTitle = card.querySelector('.course-title').textContent;
            const isFavorite = favoriteCourses.includes(courseTitle);
            
            const star = card.querySelector('.favorite-star');
            if (isFavorite) {
                star.classList.add('favorite');
                star.style.color = '#ffd700';
            }
            
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleFavorite(courseTitle, star, card);
            });
        });
    }

    toggleFavorite(courseTitle, star, card) {
        let favoriteCourses = JSON.parse(localStorage.getItem('favoriteCourses')) || [];
        const index = favoriteCourses.indexOf(courseTitle);
        
        if (index > -1) {
            favoriteCourses.splice(index, 1);
            star.style.color = '#ccc';
            star.classList.remove('favorite');
        } else {
            if (favoriteCourses.length >= 3) {
                alert('Максимум 3 избранных курса!');
                return;
            }
            favoriteCourses.unshift(courseTitle);
            star.style.color = '#ffd700';
            star.classList.add('favorite');
        }
        
        localStorage.setItem('favoriteCourses', JSON.stringify(favoriteCourses));
        this.sortCourses();
    }

    sortCourses() {
        const favoriteCourses = JSON.parse(localStorage.getItem('favoriteCourses')) || [];
        const coursesGrid = document.querySelector('.courses-grid');
        const cards = Array.from(coursesGrid.querySelectorAll('.course-card'));
        
        cards.sort((a, b) => {
            const titleA = a.querySelector('.course-title').textContent;
            const titleB = b.querySelector('.course-title').textContent;
            
            const isFavoriteA = favoriteCourses.includes(titleA);
            const isFavoriteB = favoriteCourses.includes(titleB);
            
            if (isFavoriteA && !isFavoriteB) return -1;
            if (!isFavoriteA && isFavoriteB) return 1;
            return 0;
        });

        cards.forEach(card => card.remove());
        cards.forEach(card => coursesGrid.appendChild(card));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.sdoApp = new SDOApp();
});