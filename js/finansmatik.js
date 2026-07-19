const FINANSMATIK = {
  SUPABASE_URL: 'https://gbgsykjrozmpkpsqukcp.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZ3N5a2pyb3ptcGtwc3F1a2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MDg4NjMsImV4cCI6MjA5OTI4NDg2M30.r9wAql8KLX-TfRdu1PFRjgnuLSV2JjhYlAMV8rcN_1c',
}

FINANSMATIK.api = {
  async getExchangeRates() {
    try {
      const res = await fetch(`${FINANSMATIK.SUPABASE_URL}/rest/v1/exchange_rates?select=*&order=fetch_date.desc&fetch_date=eq.${new Date().toISOString().split('T')[0]}`);
      if (!res.ok) throw new Error('Veri alınamadı');
      const data = await res.json();
      if (data.length === 0) {
        const res2 = await fetch(`${FINANSMATIK.SUPABASE_URL}/rest/v1/exchange_rates?select=*&order=fetch_date.desc&limit=10`);
        return await res2.json();
      }
      return data;
    } catch {
      return [
        { currency_code: 'USD', currency_name: 'ABD Doları', buy_rate: 30.1234, sell_rate: 30.2345 },
        { currency_code: 'EUR', currency_name: 'Euro', buy_rate: 32.5678, sell_rate: 32.6789 },
        { currency_code: 'GBP', currency_name: 'İngiliz Sterlini', buy_rate: 38.1234, sell_rate: 38.2345 },
      ];
    }
  },

  async getInflationData() {
    try {
      const res = await fetch(`${FINANSMATIK.SUPABASE_URL}/rest/v1/inflation_data?select=*&order=month.desc&limit=12`);
      if (!res.ok) throw new Error('Veri alınamadı');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getSeveranceCeiling() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`${FINANSMATIK.SUPABASE_URL}/rest/v1/severance_ceilings?select=*&valid_from=lte.${today}&order=valid_from.desc&limit=1`);
      if (!res.ok) throw new Error('Veri alınamadı');
      const data = await res.json();
      return data[0] || { ceiling_amount: 43528.50 };
    } catch {
      return { ceiling_amount: 43528.50 };
    }
  },
}

FINANSMATIK.format = {
  currency(num) {
    return '₺' + new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  },
  percent(num) {
    return '%' + new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  },
  fx(num, currency = 'USD') {
    const symbols = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF', JPY: '¥' };
    return (symbols[currency] || currency) + ' ' + new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  },
}

FINANSMATIK.calculate = {
  kiraArtis(currentRent, rate) {
    const increase = currentRent * rate / 100;
    const newRent = currentRent + increase;
    return { newRent, increase, rate };
  },

  enflasyon(amount, startDate, endDate, inflationData) {
    const startParts = startDate.split('-');
    const endParts = endDate.split('-');
    const startKey = `${startParts[0]}-${startParts[1]}-01`;
    const endKey = `${endParts[0]}-${endParts[1]}-01`;

    const startData = inflationData.find(d => d.month === startKey || d.month.startsWith(startKey));
    const endData = inflationData.find(d => d.month === endKey || d.month.startsWith(endKey));

    if (!startData || !endData) {
      const monthsDiff = (parseInt(endParts[0]) - parseInt(startParts[0])) * 12 + (parseInt(endParts[1]) - parseInt(startParts[1]));
      const estimatedInflation = monthsDiff * 5; // aylık ortalama %5 varsayım
      const newValue = amount * (1 + estimatedInflation / 100);
      return {
        newValue,
        inflationDiff: newValue - amount,
        realChange: 0,
        isEstimated: true,
      };
    }

    const cumulativeInflation = endData.yearly_avg_rate - startData.yearly_avg_rate;
    const newValue = amount * (1 + cumulativeInflation / 100);
    return {
      newValue,
      inflationDiff: newValue - amount,
      realChange: cumulativeInflation,
      isEstimated: false,
    };
  },

  kidemTazminati(grossSalary, startDate, endDate, ceiling, kullanilanIzinGunu = 0) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const totalYears = totalDays / 365;

    if (totalYears < 1) {
      return { kidem: 0, ihbar: 0, toplam: 0, mesaj: 'Kıdem tazminatı için en az 1 yıl çalışma gerekli' };
    }

    const years = Math.floor(totalYears);
    const kidemBrut = grossSalary * years;
    const kidem = Math.min(kidemBrut, ceiling * years);

    let ihbar = 0;
    if (years < 1) ihbar = grossSalary * 2 / 4;
    else if (years < 5) ihbar = grossSalary * 4 / 4;
    else if (years < 10) ihbar = grossSalary * 6 / 4;
    else ihbar = grossSalary * 8 / 4;

    const toplam = kidem + ihbar;
    return { kidem, ihbar, toplam, yil: years, gun: totalDays };
  },

  dovizButce(totalTL, currencyCode, months, exchangeRates) {
    const rate = exchangeRates.find(r => r.currency_code === currencyCode);
    if (!rate) return { fxTotal: 0, monthlyTL: 0, rate: null };
    const fxTotal = totalTL / rate.sell_rate;
    const monthlyTL = totalTL / months;
    return { fxTotal, monthlyTL, rate: rate.sell_rate };
  },

  kredi(tutar, faizOrani, vadeAy) {
    const aylikFaiz = faizOrani / 100 / 12;
    const taksit = tutar * aylikFaiz * Math.pow(1 + aylikFaiz, vadeAy) / (Math.pow(1 + aylikFaiz, vadeAy) - 1);
    const toplamOdeme = taksit * vadeAy;
    const toplamFaiz = toplamOdeme - tutar;
    return { taksit, toplamOdeme, toplamFaiz };
  },

  mevduat(anapara, faizOrani, vadeGun, stopaj = 0.10) {
    const brutFaiz = anapara * faizOrani / 100 * vadeGun / 365;
    const netFaiz = brutFaiz * (1 - stopaj);
    const bilesik = anapara + netFaiz;
    return { brutFaiz, netFaiz, bilesik };
  },

  maas(brutMaas) {
    const sgkIsci = brutMaas * 0.14;
    const issizlikIsci = brutMaas * 0.01;
    const gelirVergisiMatrah = brutMaas - sgkIsci - issizlikIsci;
    let vergi = 0;
    if (gelirVergisiMatrah <= 110000) vergi = gelirVergisiMatrah * 0.15;
    else if (gelirVergisiMatrah <= 230000) vergi = 16500 + (gelirVergisiMatrah - 110000) * 0.20;
    else if (gelirVergisiMatrah <= 580000) vergi = 40500 + (gelirVergisiMatrah - 230000) * 0.27;
    else if (gelirVergisiMatrah <= 3000000) vergi = 135000 + (gelirVergisiMatrah - 580000) * 0.35;
    else vergi = 982000 + (gelirVergisiMatrah - 3000000) * 0.40;
    const damgaVergisi = brutMaas * 0.00759;
    const netMaas = brutMaas - sgkIsci - issizlikIsci - vergi - damgaVergisi;
    return { netMaas, sgkIsci, issizlikIsci, gelirVergisi: vergi, damgaVergisi, kesintiToplam: sgkIsci + issizlikIsci + vergi + damgaVergisi };
  },
}

FINANSMATIK.nav = `
<nav class="bg-surface shadow-[0px_4px_20px_rgba(31,41,55,0.04)] sticky top-0 z-50">
  <div class="flex justify-between items-center px-4 md:px-10 h-16 w-full max-w-[1200px] mx-auto">
    <a href="/" class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-3xl">account_balance</span>
      <span class="font-headline-md text-[20px] font-bold text-primary">FinansMatik</span>
    </a>
    <div class="hidden md:flex items-center gap-6">
      <a href="/kira-artis" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Kira Artış</a>
      <a href="/enflasyon-zam" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Enflasyon</a>
      <a href="/kidem-tazminati" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Tazminat</a>
      <a href="/doviz-butce" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Döviz Bütçe</a>
      <a href="/kredi" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Kredi</a>
      <a href="/mevduat" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Mevduat</a>
      <a href="/maas" class="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Maaş</a>
    </div>
    <button class="md:hidden material-symbols-outlined text-on-surface-variant p-2" id="mobile-menu-btn">menu</button>
  </div>
</nav>
<div id="mobile-menu" class="hidden fixed inset-0 z-40 bg-surface/95 backdrop-blur-md pt-20">
  <div class="flex flex-col items-center gap-6 p-8 text-lg">
    <a href="/" class="font-headline-md text-primary">Ana Sayfa</a>
    <a href="/kira-artis" class="font-headline-md text-on-surface-variant">Kira Artış</a>
    <a href="/enflasyon-zam" class="font-headline-md text-on-surface-variant">Enflasyon</a>
    <a href="/kidem-tazminati" class="font-headline-md text-on-surface-variant">Tazminat</a>
    <a href="/doviz-butce" class="font-headline-md text-on-surface-variant">Döviz Bütçe</a>
    <a href="/kredi" class="font-headline-md text-on-surface-variant">Kredi</a>
    <a href="/mevduat" class="font-headline-md text-on-surface-variant">Mevduat</a>
    <a href="/maas" class="font-headline-md text-on-surface-variant">Maaş</a>
  </div>
</div>
`

FINANSMATIK.footer = `
<footer class="bg-surface-container-lowest border-t border-outline-variant mt-12">
  <div class="flex flex-col md:flex-row justify-between items-center py-8 px-4 md:px-10 w-full max-w-[1200px] mx-auto gap-4">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-2xl">account_balance</span>
      <span class="font-headline-md text-[20px] font-bold text-primary">FinansMatik</span>
      <span class="text-body-sm text-on-surface-variant ml-4">© 2024 FinansMatik</span>
    </div>
    <div class="flex gap-6">
      <a href="/hakkimizda" class="font-label-sm text-sm text-secondary hover:text-secondary-container underline transition-all">Hakkımızda</a>
      <a href="/gizlilik" class="font-label-sm text-sm text-secondary hover:text-secondary-container underline transition-all">Gizlilik</a>
      <a href="/iletisim" class="font-label-sm text-sm text-secondary hover:text-secondary-container underline transition-all">İletişim</a>
    </div>
  </div>
</footer>
`

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }
})
