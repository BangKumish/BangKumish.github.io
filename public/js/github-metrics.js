const formatMetric = (value) => new Intl.NumberFormat('en', { notation: value >= 1000 ? 'compact' : 'standard' }).format(value);

const hydrateGitHubMetrics = async () => {
  const cards = document.querySelectorAll('[data-github-repo]');
  await Promise.all(Array.from(cards).map(async (card) => {
    const repository = card.dataset.githubRepo;
    if (!repository) return;
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const data = await response.json();
      card.querySelector('[data-stars]').textContent = formatMetric(data.stargazers_count);
      card.querySelector('[data-forks]').textContent = formatMetric(data.forks_count);
    } catch {
      card.querySelector('[data-stars]').textContent = 'n/a';
      card.querySelector('[data-forks]').textContent = 'n/a';
      card.title = 'GitHub metrics are temporarily unavailable';
    }
  }));
};

hydrateGitHubMetrics();
