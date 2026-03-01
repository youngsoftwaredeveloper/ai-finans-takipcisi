export async function getExchangeRate() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
        const data = await response.json();
        return data.rates.TRY;
    } catch (error) {
        console.error('Döviz kuru alınamadı:', error);
        // Fallback kur (yaklaşık değer)
        return 31.00;
    }
}
