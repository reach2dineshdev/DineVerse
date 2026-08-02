export function convertMinutes(min) {
    if (!min) return 'N/A';
    const hours = Math.floor(min / 60);
    const remainingMinutes = min % 60;
    return `${hours}h ${remainingMinutes}m`;
}

export function formatMoney(amount) {
    if (!amount || amount === 0) return 'N/A';
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
    if (amount >= 1_000_000)     return `$${(amount / 1_000_000).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}