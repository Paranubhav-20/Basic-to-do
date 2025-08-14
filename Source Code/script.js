document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const pendingTasks = document.getElementById('pendingTasks');
    const completedTasks = document.getElementById('completedTasks');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    renderTasks();

    // Add new task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    function renderTasks() {
        pendingTasks.innerHTML = '';
        completedTasks.innerHTML = '';

        const pendingItems = tasks.filter(task => !task.completed);
        const completedItems = tasks.filter(task => task.completed);

        pendingCount.textContent = `${pendingItems.length} ${pendingItems.length === 1 ? 'task' : 'tasks'}`;
        completedCount.textContent = `${completedItems.length} ${completedItems.length === 1 ? 'task' : 'tasks'}`;

        // Render pending tasks
        pendingItems.forEach(task => {
            const taskElement = createTaskElement(task);
            pendingTasks.appendChild(taskElement);
        });

        // Render completed tasks
        completedItems.forEach(task => {
            const taskElement = createTaskElement(task);
            completedTasks.appendChild(taskElement);
        });

        // Placeholders
        if (tasks.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'text-center py-8 text-gray-500';
            placeholder.innerHTML = `
                <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/07158a4f-35e6-404f-bbe3-c09758b23847.png" alt="Add tasks illustration" class="mx-auto mb-4 rounded-lg">
                <p>No pending tasks yet</p>
                <p class="text-xs mt-1 text-indigo-500">Add your first task to get started</p>
            `;
            pendingTasks.appendChild(placeholder);
        }

        if (completedItems.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'text-center py-8 text-gray-500';
            placeholder.innerHTML = `
                <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/49153189-07ae-4c11-b5ad-6a30d525bc99.png" alt="Completed tasks illustration" class="mx-auto mb-4 rounded-lg">
                <p>No completed tasks yet</p>
                <p class="text-xs mt-1 text-emerald-500">Complete some tasks to see them here</p>
            `;
            completedTasks.appendChild(placeholder);
        }
    }

    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item p-4 rounded-lg ${task.completed ? 'completed-task bg-gray-50' : 'pending-task'}`;
        taskElement.dataset.id = task.id;

        const formattedCreatedDate = formatDateTime(task.createdAt);
        const formattedCompletedDate = task.completedAt ? formatDateTime(task.completedAt) : null;

        taskElement.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <span class="task-text ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${task.text}</span>
                <div class="flex space-x-2">
                    <button class="edit-btn p-1 text-gray-500 hover:text-indigo-600">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="delete-btn p-1 text-gray-500 hover:text-red-600">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div class="timestamp text-xs">
                    Added: ${formattedCreatedDate}
                    ${formattedCompletedDate ? `<br>Completed: ${formattedCompletedDate}` : ''}
                </div>
                ${!task.completed ? `
                    <button class="complete-btn py-1 px-3 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition">
                        Mark Complete
                    </button>
                ` : ''}
            </div>
        `;

        if (!task.completed) {
            const completeBtn = taskElement.querySelector('.complete-btn');
            completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
        }

        const editBtn = taskElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editTask(task.id));

        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        return taskElement;
    }

    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;
            saveTasks();
            renderTasks();
        }
    }

    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;

        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Floating particles
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 50 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5;
        
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        document.body.appendChild(particle);
    }
});
