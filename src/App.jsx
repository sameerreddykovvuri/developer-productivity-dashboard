import { useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   AUTHENTICATION
========================================================= */

function AuthScreen({ onLogin }) {
  const [page, setPage] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setMessage("");
  };

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("devflow_users") || "[]");
  };

  const saveUsers = (users) => {
    localStorage.setItem("devflow_users", JSON.stringify(users));
  };

  const login = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    const users = getUsers();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === form.email.toLowerCase() &&
        u.password === form.password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("devflow_current_user", JSON.stringify(user));

    onLogin(user);
  };

  const signup = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = getUsers();

    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    );

    if (alreadyExists) {
      setError("An account with this email already exists.");
      return;
    }

    const initials = form.name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      initials: initials || "DF",
    };

    saveUsers([...users, newUser]);

    localStorage.setItem(
      "devflow_current_user",
      JSON.stringify(newUser)
    );

    onLogin(newUser);
  };

  const forgotPassword = (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    const users = getUsers();

    const exists = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    );

    if (!exists) {
      setError("No account found with this email.");
      return;
    }

    setError("");
    setMessage(
      "Password reset instructions have been sent to your email."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-orb orb-one"></div>
        <div className="auth-orb orb-two"></div>
        <div className="auth-orb orb-three"></div>
      </div>

      <div className="auth-container">

        <div className="auth-brand">
          <div className="auth-logo">✦</div>

          <div>
            <h1>DevFlow</h1>
            <span>Productivity Hub</span>
          </div>
        </div>

        <div className="auth-card">

          {page === "login" && (
            <>
              <div className="auth-heading">
                <span className="auth-eyebrow">WELCOME BACK</span>
                <h2>Welcome back 👋</h2>
                <p>
                  Sign in to continue to your productivity workspace.
                </p>
              </div>

              <form onSubmit={login}>

                <div className="field">
                  <label>Email address</label>

                  <div className="input-wrap">
                    <span>✉</span>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="label-row">
                    <label>Password</label>

                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        setPage("forgot");
                        setError("");
                        setMessage("");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="input-wrap">
                    <span>🔒</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        update("password", e.target.value)
                      }
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      className="eye-button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>
                  </div>
                </div>

                <label className="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                {error && (
                  <div className="auth-error">
                    ⚠ {error}
                  </div>
                )}

                <button className="auth-submit" type="submit">
                  Sign In
                  <span>→</span>
                </button>

              </form>

              <div className="auth-divider">
                <span>New to DevFlow?</span>
              </div>

              <button
                className="outline-auth-button"
                onClick={() => {
                  setPage("signup");
                  setError("");
                  setMessage("");
                }}
              >
                Create an account
              </button>
            </>
          )}

          {page === "signup" && (
            <>
              <div className="auth-heading">
                <span className="auth-eyebrow">GET STARTED</span>
                <h2>Create your account</h2>
                <p>
                  Build better habits and manage your work in one place.
                </p>
              </div>

              <form onSubmit={signup}>

                <div className="field">
                  <label>Full name</label>

                  <div className="input-wrap">
                    <span>♙</span>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        update("name", e.target.value)
                      }
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Email address</label>

                  <div className="input-wrap">
                    <span>✉</span>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>

                  <div className="input-wrap">
                    <span>🔒</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        update("password", e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                    />

                    <button
                      type="button"
                      className="eye-button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>Confirm password</label>

                  <div className="input-wrap">
                    <span>🔐</span>

                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        update(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Repeat your password"
                    />

                    <button
                      type="button"
                      className="eye-button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                    >
                      {showConfirm ? "◉" : "◌"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="auth-error">
                    ⚠ {error}
                  </div>
                )}

                <button className="auth-submit" type="submit">
                  Create Account
                  <span>→</span>
                </button>

              </form>

              <div className="auth-switch">
                Already have an account?

                <button
                  onClick={() => {
                    setPage("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>
              </div>
            </>
          )}

          {page === "forgot" && (
            <>
              <div className="forgot-icon">🔑</div>

              <div className="auth-heading center">
                <span className="auth-eyebrow">
                  ACCOUNT RECOVERY
                </span>

                <h2>Forgot your password?</h2>

                <p>
                  Enter your registered email and we'll help you
                  reset your password.
                </p>
              </div>

              <form onSubmit={forgotPassword}>

                <div className="field">
                  <label>Email address</label>

                  <div className="input-wrap">
                    <span>✉</span>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="auth-error">
                    ⚠ {error}
                  </div>
                )}

                {message && (
                  <div className="auth-success">
                    ✓ {message}
                  </div>
                )}

                <button className="auth-submit" type="submit">
                  Send Reset Link
                  <span>→</span>
                </button>

              </form>

              <button
                className="back-login"
                onClick={() => {
                  setPage("login");
                  setError("");
                  setMessage("");
                }}
              >
                ← Back to Sign In
              </button>
            </>
          )}

        </div>

        <div className="auth-footer">
          <span>© 2026 DevFlow</span>
          <span>Built for better productivity ✦</span>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   MAIN DASHBOARD
========================================================= */

function Dashboard({ user, onLogout }) {

  const [active, setActive] = useState("Overview");
  const [theme, setTheme] = useState("dark");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Developer",
    initials: user?.initials || "DF",
    email: user?.email || "developer@devflow.com",
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Build dashboard UI",
      tag: "Development",
      done: true,
    },
    {
      id: 2,
      title: "Connect GitHub API",
      tag: "Integration",
      done: true,
    },
    {
      id: 3,
      title: "Create analytics section",
      tag: "Development",
      done: false,
    },
    {
      id: 4,
      title: "Write project documentation",
      tag: "Documentation",
      done: false,
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Developer Productivity Dashboard",
      tech: "React • Node.js • GitHub API",
      percent: 78,
    },
    {
      id: 2,
      title: "Smart Task Manager",
      tech: "React • Firebase",
      percent: 64,
    },
    {
      id: 3,
      title: "Analytics Engine",
      tech: "Python • FastAPI",
      percent: 51,
    },
  ]);

  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Sameer Reddy",
      role: "Frontend Developer",
      initials: "SR",
      online: true,
    },
    {
      id: 2,
      name: "spoorthi",
      role: "Backend Developer",
      initials: "rs",
      online: true,
    },
    {
      id: 3,
      name: "sri",
      role: "UI/UX Designer",
      initials: "ss",
      online: false,
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    tag: "Development",
  });

  const [showProjectForm, setShowProjectForm] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    tech: "",
    percent: 0,
  });

  const [preferences, setPreferences] = useState({
    email: true,
    reminder: true,
    completed: true,
  });

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  const navItems = [
    ["Overview", "⌂"],
    ["Tasks", "✓"],
    ["Analytics", "◈"],
    ["Projects", "◆"],
    ["Team", "♙"],
  ];

  const notifications = [
    "Dashboard UI task completed",
    `${pending} pending task${pending === 1 ? "" : "s"} remaining`,
    "Analytics Engine is 51% complete",
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  /* =====================================================
     TASK FUNCTIONS
  ===================================================== */

  const addTask = () => {
    if (!newTask.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: newTask.title.trim(),
                tag: newTask.tag,
              }
            : task
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newTask.title.trim(),
          tag: newTask.tag,
          done: false,
        },
      ]);
    }

    setEditingTask(null);

    setNewTask({
      title: "",
      tag: "Development",
    });

    setShowTaskForm(false);
  };

  const editTask = (task) => {
    setEditingTask(task);

    setNewTask({
      title: task.title,
      tag: task.tag,
    });

    setShowTaskForm(true);
  };

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  };

  /* =====================================================
     PROJECT FUNCTIONS
  ===================================================== */

  const addProject = () => {
    if (!newProject.title.trim()) return;

    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newProject.title.trim(),
        tech: newProject.tech || "React",
        percent: Number(newProject.percent),
      },
    ]);

    setNewProject({
      title: "",
      tech: "",
      percent: 0,
    });

    setShowProjectForm(false);
  };

  const updateProjectProgress = (id, value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              percent: Number(value),
            }
          : project
      )
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  /* =====================================================
     TEAM
  ===================================================== */

  const removeMember = (id) => {
    setTeam((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  /* =====================================================
     SETTINGS
  ===================================================== */

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = () => {
    const current = JSON.parse(
      localStorage.getItem("devflow_current_user") || "{}"
    );

    const updated = {
      ...current,
      name: profile.name,
      initials: profile.initials,
      email: profile.email,
    };

    localStorage.setItem(
      "devflow_current_user",
      JSON.stringify(updated)
    );
  };

  const logout = () => {
    localStorage.removeItem("devflow_current_user");
    onLogout();
  };

  return (
    <div className={`app ${theme}`}>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h2>DevFlow</h2>
            <span>Productivity Hub</span>
          </div>
        </div>

        <div className="workspace-title">
          WORKSPACE
        </div>

        <nav>
          {navItems.map(([name, icon]) => (
            <button
              key={name}
              className={
                active === name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActive(name)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <div className="streak">
            <div className="fire">🔥</div>

            <div>
              <strong>7 day streak</strong>
              <span>Keep it going!</span>
            </div>
          </div>

          <button
            className="settings"
            onClick={() => setActive("Settings")}
          >
            ⚙ Settings
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">

        <header className="topbar">

          <div>
            <p className="greeting">
              Good afternoon 👋
            </p>

            <h1>{active}</h1>
          </div>

          <div className="top-actions">

            <button
              className="round-btn"
              onClick={() => {
                setShowSearch(!showSearch);
                setShowNotifications(false);
              }}
            >
              ⌕
            </button>

            <button
              className="round-btn notification"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSearch(false);
              }}
            >
              ♢
            </button>

            <div
              className="profile"
              onClick={() => setActive("Settings")}
            >
              <div className="avatar">
                {profile.initials}
              </div>

              <div>
                <strong>{profile.name}</strong>
                <span>Active now</span>
              </div>
            </div>

          </div>

          {showSearch && (
            <div className="search-box">

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tasks and projects..."
              />

              {search && (
                <div className="search-results">

                  {filteredTasks.length > 0 && (
                    <>
                      <small>TASKS</small>

                      {filteredTasks.map((task) => (
                        <div
                          className="search-result"
                          key={task.id}
                          onClick={() => {
                            setActive("Tasks");
                            setShowSearch(false);
                          }}
                        >
                          ✓ {task.title}
                        </div>
                      ))}
                    </>
                  )}

                  {filteredProjects.length > 0 && (
                    <>
                      <small>PROJECTS</small>

                      {filteredProjects.map((project) => (
                        <div
                          className="search-result"
                          key={project.id}
                          onClick={() => {
                            setActive("Projects");
                            setShowSearch(false);
                          }}
                        >
                          ◆ {project.title}
                        </div>
                      ))}
                    </>
                  )}

                  {filteredTasks.length === 0 &&
                    filteredProjects.length === 0 && (
                      <div className="no-results">
                        No results found
                      </div>
                    )}

                </div>
              )}

            </div>
          )}

          {showNotifications && (
            <div className="notification-panel">

              <div className="notification-header">
                <h3>Notifications</h3>
                <span>{notifications.length}</span>
              </div>

              {notifications.map((notification, index) => (
                <div
                  className="notification-item"
                  key={index}
                >
                  <div className="notification-dot">
                    ●
                  </div>

                  <span>{notification}</span>
                </div>
              ))}

            </div>
          )}

        </header>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {active === "Overview" && (
          <>

            <section className="hero-card">

              <div className="hero-glow"></div>

              <div className="hero-content">

                <span className="focus-label">
                  ✦ TODAY'S FOCUS
                </span>

                <h2>
                  Build. Track. Improve.
                </h2>

                <p>
                  Everything you need to stay focused,
                  manage your work, and understand your
                  productivity.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setActive("Tasks");
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                >
                  + Create New Task
                </button>

              </div>

              <div
                className="progress-ring"
                style={{
                  background: `conic-gradient(
                    #ff91d4 0 ${progress}%,
                    rgba(255,255,255,.14) ${progress}% 100%
                  )`,
                }}
              >
                <div className="ring-inner">
                  <strong>{progress}%</strong>
                  <span>Complete</span>
                </div>
              </div>

            </section>

            <section className="stats">

              <Stat
                icon="✓"
                color="purple"
                title="Tasks Completed"
                value={completed}
                subtitle={`${tasks.length} total tasks`}
              />

              <Stat
                icon="◷"
                color="cyan"
                title="Focus Hours"
                value="32.5h"
                subtitle="↗ 12% this week"
              />

              <Stat
                icon="⚡"
                color="green"
                title="Productivity"
                value={`${progress}%`}
                subtitle="Based on tasks"
              />

              <Stat
                icon="🔥"
                color="orange"
                title="Current Streak"
                value="7 days"
                subtitle="Personal best: 12"
              />

            </section>

            <section className="dashboard-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>Today's Tasks</h3>
                    <span>
                      {completed} of {tasks.length} completed
                    </span>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => setActive("Tasks")}
                  >
                    View all →
                  </button>

                </div>

                {tasks.slice(0, 4).map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    editTask={editTask}
                    deleteTask={deleteTask}
                  />
                ))}

              </div>

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>Productivity</h3>
                    <span>
                      Based on task completion
                    </span>
                  </div>

                  <span className="chart-badge">
                    {progress}%
                  </span>

                </div>

                <div className="chart">

                  {[55, 72, 48, 82, 67, progress, 88].map(
                    (height, i) => (
                      <div
                        className="bar-wrap"
                        key={i}
                      >
                        <div
                          className="bar"
                          style={{
                            height: `${Math.max(
                              height,
                              10
                            )}%`,
                          }}
                        />

                        <span>
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </span>
                      </div>
                    )
                  )}

                </div>

              </div>

            </section>

          </>
        )}

        {/* =================================================
            TASKS
        ================================================= */}

        {active === "Tasks" && (
          <section>

            <div className="page-actions">

              <div>
                <h2>Task Manager</h2>
                <p>
                  Create and manage your daily work.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => {
                  setEditingTask(null);

                  setNewTask({
                    title: "",
                    tag: "Development",
                  });

                  setShowTaskForm(true);
                }}
              >
                + Add Task
              </button>

            </div>

            {showTaskForm && (
              <div className="form-card">

                <h3>
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h3>

                <input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                  placeholder="Task title"
                />

                <select
                  value={newTask.tag}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      tag: e.target.value,
                    })
                  }
                >
                  <option>Development</option>
                  <option>Integration</option>
                  <option>Documentation</option>
                  <option>Testing</option>
                  <option>Design</option>
                </select>

                <div className="form-actions">

                  <button
                    className="primary-btn"
                    onClick={addTask}
                  >
                    {editingTask ? "Update" : "Add Task"}
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            <div className="full-panel">

              <div className="panel-header">
                <div>
                  <h3>All Tasks</h3>
                  <span>
                    {completed} completed • {pending} pending
                  </span>
                </div>
              </div>

              {tasks.length === 0 && (
                <div className="empty">
                  No tasks yet. Create your first task.
                </div>
              )}

              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  editTask={editTask}
                  deleteTask={deleteTask}
                  large
                />
              ))}

            </div>

          </section>
        )}

        {/* =================================================
            ANALYTICS
        ================================================= */}

        {active === "Analytics" && (
          <Analytics
            tasks={tasks}
            completed={completed}
            pending={pending}
            progress={progress}
          />
        )}

        {/* =================================================
            PROJECTS
        ================================================= */}

        {active === "Projects" && (
          <section>

            <div className="page-actions">

              <div>
                <h2>Projects</h2>
                <p>
                  Manage your active projects and progress.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowProjectForm(!showProjectForm)
                }
              >
                + Add Project
              </button>

            </div>

            {showProjectForm && (
              <div className="form-card">

                <h3>Create Project</h3>

                <input
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      title: e.target.value,
                    })
                  }
                  placeholder="Project name"
                />

                <input
                  value={newProject.tech}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      tech: e.target.value,
                    })
                  }
                  placeholder="Technologies e.g. React • Firebase"
                />

                <label>
                  Progress: {newProject.percent}%
                </label>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProject.percent}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      percent: e.target.value,
                    })
                  }
                />

                <div className="form-actions">

                  <button
                    className="primary-btn"
                    onClick={addProject}
                  >
                    Create Project
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setShowProjectForm(false)
                    }
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            <div className="project-grid">

              {projects.map((project) => (
                <div
                  className="project-card"
                  key={project.id}
                >

                  <div className="project-top">

                    <div>
                      <strong>{project.title}</strong>
                      <span>{project.tech}</span>
                    </div>

                    <b>{project.percent}%</b>

                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${project.percent}%`,
                      }}
                    />
                  </div>

                  <div className="range-row">
                    <span>Progress</span>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={project.percent}
                      onChange={(e) =>
                        updateProjectProgress(
                          project.id,
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProject(project.id)
                    }
                  >
                    Delete Project
                  </button>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* =================================================
            TEAM
        ================================================= */}

        {active === "Team" && (
          <section>

            <div className="page-actions">

              <div>
                <h2>Team</h2>
                <p>
                  Your development team and recent activity.
                </p>
              </div>

            </div>

            <div className="team-grid">

              {team.map((member) => (
                <div
                  className="team-card"
                  key={member.id}
                >

                  <div className="team-avatar">
                    {member.initials}
                  </div>

                  <h3>{member.name}</h3>

                  <p>{member.role}</p>

                  <span
                    className={
                      member.online
                        ? "online"
                        : "offline"
                    }
                  >
                    ● {member.online ? "Online" : "Offline"}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeMember(member.id)
                    }
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>

            <div className="full-panel activity-section">

              <h3>Recent Team Activity</h3>

              <Activity
                icon="✓"
                text="Sameer completed dashboard UI"
                time="12 minutes ago"
              />

              <Activity
                icon="⚡"
                text="Mukundha pushed 4 commits"
                time="1 hour ago"
              />

              <Activity
                icon="★"
                text="Phaneendra updated the UI"
                time="3 hours ago"
              />

            </div>

          </section>
        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {active === "Settings" && (
          <section>

            <div className="page-actions">

              <div>
                <h2>Settings</h2>
                <p>
                  Customize your DevFlow experience.
                </p>
              </div>

            </div>

            <div className="settings-grid">

              <div className="settings-card">

                <h3>Profile</h3>

                <label>Name</label>

                <input
                  value={profile.name}
                  onChange={(e) =>
                    handleProfileChange(
                      "name",
                      e.target.value
                    )
                  }
                />

                <label>Initials</label>

                <input
                  value={profile.initials}
                  maxLength={3}
                  onChange={(e) =>
                    handleProfileChange(
                      "initials",
                      e.target.value.toUpperCase()
                    )
                  }
                />

                <label>Email</label>

                <input
                  value={profile.email}
                  onChange={(e) =>
                    handleProfileChange(
                      "email",
                      e.target.value
                    )
                  }
                />

                <button
                  className="primary-btn save-button"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>

              </div>

              <div className="settings-card">

                <h3>Appearance</h3>

                <div className="setting-row">

                  <div>
                    <strong>Theme</strong>
                    <span>
                      Choose your preferred appearance
                    </span>
                  </div>

                  <select
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value)
                    }
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>

                </div>

              </div>

              <div className="settings-card">

                <h3>Preferences</h3>

                <div className="toggle-row">
                  <span>Email notifications</span>

                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        email: e.target.checked,
                      })
                    }
                  />
                </div>

                <div className="toggle-row">
                  <span>Daily productivity reminder</span>

                  <input
                    type="checkbox"
                    checked={preferences.reminder}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        reminder: e.target.checked,
                      })
                    }
                  />
                </div>

                <div className="toggle-row">
                  <span>Show completed tasks</span>

                  <input
                    type="checkbox"
                    checked={preferences.completed}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        completed: e.target.checked,
                      })
                    }
                  />
                </div>

              </div>

            </div>

            <div className="danger-zone">

              <div>
                <h3>Account</h3>
                <p>
                  Sign out from your current DevFlow session.
                </p>
              </div>

              <button
                className="danger-button"
                onClick={logout}
              >
                Logout
              </button>

            </div>

          </section>
        )}

        <footer>
          <span>© 2026 DevFlow</span>

          <span>
            Built for better productivity ✦
          </span>
        </footer>

      </main>
    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function Stat({
  icon,
  color,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>

    </div>
  );
}


function TaskRow({
  task,
  toggleTask,
  editTask,
  deleteTask,
  large = false,
}) {
  return (
    <div className={`task ${large ? "large-task" : ""}`}>

      <button
        className={
          task.done
            ? "check checked"
            : "check"
        }
        onClick={() =>
          toggleTask(task.id)
        }
      >
        {task.done ? "✓" : ""}
      </button>

      <div className="task-info">

        <strong
          className={
            task.done
              ? "done"
              : ""
          }
        >
          {task.title}
        </strong>

        <span>{task.tag}</span>

      </div>

      {large && (
        <button
          className="edit-btn"
          onClick={() =>
            editTask(task)
          }
        >
          Edit
        </button>
      )}

      <button
        className="delete-btn"
        onClick={() =>
          deleteTask(task.id)
        }
      >
        Delete
      </button>

    </div>
  );
}


function Analytics({
  tasks,
  completed,
  pending,
  progress,
}) {

  const categories = [
    "Development",
    "Integration",
    "Documentation",
    "Testing",
    "Design",
  ];

  return (
    <section>

      <div className="page-actions">

        <div>
          <h2>Analytics</h2>

          <p>
            Real productivity statistics from your tasks.
          </p>
        </div>

      </div>

      <div className="analytics-stats">

        <div className="analytics-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="analytics-card">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="analytics-card">
          <span>Pending</span>
          <strong>{pending}</strong>
        </div>

        <div className="analytics-card">
          <span>Completion Rate</span>
          <strong>{progress}%</strong>
        </div>

      </div>

      <div className="full-panel">

        <div className="panel-header">

          <div>
            <h3>Task Distribution</h3>

            <span>
              Tasks grouped by category
            </span>
          </div>

        </div>

        {categories.map((category) => {

          const value = tasks.filter(
            (task) =>
              task.tag === category
          ).length;

          return (
            <AnalyticsBar
              key={category}
              name={category}
              value={value}
              total={tasks.length}
            />
          );
        })}

      </div>

      <div className="full-panel">

        <h3>Completion Progress</h3>

        <div className="big-progress">

          <div
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="progress-number">
          {progress}% completed
        </div>

      </div>

    </section>
  );
}


function AnalyticsBar({
  name,
  value,
  total,
}) {

  const percent =
    total === 0
      ? 0
      : Math.round(
          (value / total) * 100
        );

  return (
    <div className="analytics-bar">

      <div className="analytics-bar-top">

        <span>{name}</span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="progress">

        <div
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}


function Activity({
  icon,
  text,
  time,
}) {
  return (
    <div className="activity">

      <div className="activity-icon">
        {icon}
      </div>

      <div>
        <strong>{text}</strong>
        <span>{time}</span>
      </div>

    </div>
  );
}


/* =========================================================
   ROOT APP
========================================================= */

function App() {

  const [user, setUser] = useState(() => {

    try {
      return JSON.parse(
        localStorage.getItem(
          "devflow_current_user"
        )
      );
    } catch {
      return null;
    }

  });

  if (!user) {
    return (
      <AuthScreen
        onLogin={(loggedUser) =>
          setUser(loggedUser)
        }
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}

export default App;