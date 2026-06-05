<template>
  <header class="app-header">
    <RouterLink to="/" class="site-name"> MediaFinder </RouterLink>
    <div class="search-wrapper">
      <input
        type="text"
        placeholder="Search for movies, TV shows, and more..."
        class="search-input"
      />
    </div>

    <button class="login-button" disabled>Login</button>
  </header>
</template>

<style scoped>
.app-header {
  height: 72px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #111;
  border-bottom: 1px solid #2a2a2a;
}

.site-name {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 520px;
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  border: 1px solid #333;
  background: #1c1c1c;
  color: #fff;
}

.search-input::placeholder {
  color: #777;
}

.login-button {
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  color: #111;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
