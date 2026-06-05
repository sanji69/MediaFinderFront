<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>© 2026 Axel AUBRY - MediaFinder</p>
      <p class="footer-note">Movie and TV data provided by TMDb.</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background: #111;
  border-top: 1px solid #2a2a2a;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-content p {
  margin: 0;
  color: #bdbdbd;
  font-size: 0.9rem;
}

.footer-note {
  color: #777;
}
</style>
