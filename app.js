/**
 * SalesPulse Analytics Dashboard - Pure Vanilla JS
 * Storage: HTML5 localStorage (No backend required)
 * Charts: Pure HTML5 Canvas rendering (No external libraries, zero CSS variables)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'salespulse_sales_data_v1';
  const REVENUE_GOAL = 150000; // $150,000 quarterly goal

  // Distinct palette colors for categories & charts
  const PALETTE = [
    '#38bdf8', // Sky Blue
    '#818cf8', // Indigo
    '#34d399', // Emerald Green
    '#fbbf24', // Amber
    '#f472b6', // Pink
    '#a855f7', // Purple
    '#fb923c', // Orange
    '#2dd4bf'  // Teal
  ];

  // Category Color Map
  const CATEGORY_COLORS = {
    'Electronics': '#38bdf8',
    'Software': '#818cf8',
    'Apparel': '#34d399',
    'Home & Living': '#fbbf24',
    'Accessories': '#f472b6',
    'Services': '#a855f7'
  };

  // --- Date Helpers ---
  function parseLocalDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(dateStr);
  }

  function formatLocalDateString(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Initial Seed Data Generator ---
  function getSampleSales() {
    const today = new Date();
    
    // Helper to format local date string (YYYY-MM-DD)
    const offsetDate = (daysAgo) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
      return formatLocalDateString(d);
    };

    return [
      {
        id: 'ORD-9801',
        customer: 'Elena Rostova',
        email: 'elena.r@quantum.io',
        product: 'Enterprise Cloud License',
        category: 'Software',
        channel: 'B2B Wholesale',
        quantity: 2,
        price: 1850.00,
        amount: 3700.00,
        date: offsetDate(0), // Today
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9802',
        customer: 'Marcus Vance',
        email: 'marcus.v@gmail.com',
        product: 'Wireless Noise-Canceling Headphones',
        category: 'Electronics',
        channel: 'Online',
        quantity: 1,
        price: 299.99,
        amount: 299.99,
        date: offsetDate(0), // Today
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9799',
        customer: 'Sophia Chen',
        email: 'sophia.c@techhive.net',
        product: '4K UltraWide Monitor 34"',
        category: 'Electronics',
        channel: 'Online',
        quantity: 2,
        price: 749.50,
        amount: 1499.00,
        date: offsetDate(1),
        paymentMethod: 'PayPal',
        status: 'Completed'
      },
      {
        id: 'ORD-9798',
        customer: 'Liam Gallagher',
        email: 'liam.g@acme-corp.com',
        product: 'Annual Priority SLA Support',
        category: 'Services',
        channel: 'B2B Wholesale',
        quantity: 1,
        price: 2400.00,
        amount: 2400.00,
        date: offsetDate(1),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9795',
        customer: 'Amara Okafor',
        email: 'amara.okafor@outlook.com',
        product: 'Ergonomic Mesh Task Chair',
        category: 'Home & Living',
        channel: 'Retail',
        quantity: 1,
        price: 450.00,
        amount: 450.00,
        date: offsetDate(2),
        paymentMethod: 'Apple Pay',
        status: 'Completed'
      },
      {
        id: 'ORD-9794',
        customer: 'David Kim',
        email: 'david.k@apexdesign.co',
        product: 'Creative Suite Pro - 1 Year',
        category: 'Software',
        channel: 'Affiliate',
        quantity: 3,
        price: 399.00,
        amount: 1197.00,
        date: offsetDate(3),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9791',
        customer: 'Chloe Martinez',
        email: 'chloe.m@gmail.com',
        product: 'Minimalist Leather Laptop Sleeve',
        category: 'Accessories',
        channel: 'Online',
        quantity: 2,
        price: 75.00,
        amount: 150.00,
        date: offsetDate(4),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9790',
        customer: 'Julian Brandt',
        email: 'j.brandt@nordic.de',
        product: 'Mechanical Gaming Keyboard',
        category: 'Electronics',
        channel: 'Retail',
        quantity: 1,
        price: 180.00,
        amount: 180.00,
        date: offsetDate(4),
        paymentMethod: 'Cash',
        status: 'Refunded'
      },
      {
        id: 'ORD-9788',
        customer: 'Rachel Green',
        email: 'rachel@greenfashion.co',
        product: 'Merino Wool Executive Blazer',
        category: 'Apparel',
        channel: 'Retail',
        quantity: 2,
        price: 285.00,
        amount: 570.00,
        date: offsetDate(5),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9785',
        customer: 'Alexander Wright',
        email: 'a.wright@solaris.org',
        product: 'Smart Standing Desk motorized',
        category: 'Home & Living',
        channel: 'Online',
        quantity: 1,
        price: 890.00,
        amount: 890.00,
        date: offsetDate(6),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9782',
        customer: 'Zoe Kravitz',
        email: 'zoe.k@studio.la',
        product: 'Security Auditing Consultation',
        category: 'Services',
        channel: 'B2B Wholesale',
        quantity: 1,
        price: 3200.00,
        amount: 3200.00,
        date: offsetDate(7),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9780',
        customer: 'Thomas Shelby',
        email: 't.shelby@peaky.co.uk',
        product: 'Tailored Heritage Trench Coat',
        category: 'Apparel',
        channel: 'Retail',
        quantity: 1,
        price: 620.00,
        amount: 620.00,
        date: offsetDate(8),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9777',
        customer: 'Hannah Abbott',
        email: 'hannah.a@huffle.edu',
        product: 'USB-C Multiport Docking Station',
        category: 'Accessories',
        channel: 'Online',
        quantity: 3,
        price: 110.00,
        amount: 330.00,
        date: offsetDate(9),
        paymentMethod: 'PayPal',
        status: 'Completed'
      },
      {
        id: 'ORD-9775',
        customer: 'Kenji Sato',
        email: 'kenji.sato@tokyo-lab.jp',
        product: 'Team Collaboration Hub License',
        category: 'Software',
        channel: 'Online',
        quantity: 5,
        price: 250.00,
        amount: 1250.00,
        date: offsetDate(11),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9772',
        customer: 'Isabella Rossi',
        email: 'isabella.rossi@milan.it',
        product: 'Wireless Noise-Canceling Headphones',
        category: 'Electronics',
        channel: 'Affiliate',
        quantity: 1,
        price: 299.99,
        amount: 299.99,
        date: offsetDate(13),
        paymentMethod: 'Apple Pay',
        status: 'Completed'
      },
      {
        id: 'ORD-9770',
        customer: 'Lucas Meyer',
        email: 'lucas.m@berlin-tech.de',
        product: '4K UltraWide Monitor 34"',
        category: 'Electronics',
        channel: 'Online',
        quantity: 1,
        price: 749.50,
        amount: 749.50,
        date: offsetDate(14),
        paymentMethod: 'PayPal',
        status: 'Pending'
      },
      {
        id: 'ORD-9768',
        customer: 'Nadia Petrova',
        email: 'nadia.p@vanguard.ru',
        product: 'Data Migration & Onboarding',
        category: 'Services',
        channel: 'B2B Wholesale',
        quantity: 1,
        price: 1950.00,
        amount: 1950.00,
        date: offsetDate(16),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9765',
        customer: 'Oscar Isaac',
        email: 'oscar.i@hollywood.com',
        product: 'Smart Standing Desk motorized',
        category: 'Home & Living',
        channel: 'Retail',
        quantity: 1,
        price: 890.00,
        amount: 890.00,
        date: offsetDate(18),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9762',
        customer: 'Beatrice Webb',
        email: 'beatrice.w@oxford.ac.uk',
        product: 'Enterprise Cloud License',
        category: 'Software',
        channel: 'Online',
        quantity: 1,
        price: 1850.00,
        amount: 1850.00,
        date: offsetDate(20),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9759',
        customer: 'Gabriel Silva',
        email: 'gabriel.s@rio.br',
        product: 'Minimalist Leather Laptop Sleeve',
        category: 'Accessories',
        channel: 'Online',
        quantity: 1,
        price: 75.00,
        amount: 75.00,
        date: offsetDate(22),
        paymentMethod: 'Credit Card',
        status: 'Refunded'
      },
      {
        id: 'ORD-9755',
        customer: 'Devon Miles',
        email: 'devon.m@flagship.com',
        product: 'Merino Wool Executive Blazer',
        category: 'Apparel',
        channel: 'Affiliate',
        quantity: 1,
        price: 285.00,
        amount: 285.00,
        date: offsetDate(24),
        paymentMethod: 'PayPal',
        status: 'Completed'
      },
      {
        id: 'ORD-9752',
        customer: 'Priya Sharma',
        email: 'priya.s@bangalore.in',
        product: 'Wireless Noise-Canceling Headphones',
        category: 'Electronics',
        channel: 'Online',
        quantity: 2,
        price: 299.99,
        amount: 599.98,
        date: offsetDate(26),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9750',
        customer: 'Fiona Appleby',
        email: 'fiona.a@soundtrack.fm',
        product: 'Mechanical Gaming Keyboard',
        category: 'Electronics',
        channel: 'Retail',
        quantity: 2,
        price: 180.00,
        amount: 360.00,
        date: offsetDate(28),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9745',
        customer: 'Carlos Santana',
        email: 'carlos@santana.mx',
        product: 'Annual Priority SLA Support',
        category: 'Services',
        channel: 'B2B Wholesale',
        quantity: 1,
        price: 2400.00,
        amount: 2400.00,
        date: offsetDate(32),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9740',
        customer: 'Maya Lin',
        email: 'maya@studio-lin.org',
        product: 'Creative Suite Pro - 1 Year',
        category: 'Software',
        channel: 'Online',
        quantity: 2,
        price: 399.00,
        amount: 798.00,
        date: offsetDate(35),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9736',
        customer: 'Viktor Frankl',
        email: 'viktor@vienna.at',
        product: '4K UltraWide Monitor 34"',
        category: 'Electronics',
        channel: 'Retail',
        quantity: 1,
        price: 749.50,
        amount: 749.50,
        date: offsetDate(40),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9730',
        customer: 'Emily Thorne',
        email: 'emily.t@hampton.com',
        product: 'Tailored Heritage Trench Coat',
        category: 'Apparel',
        channel: 'Online',
        quantity: 2,
        price: 620.00,
        amount: 1240.00,
        date: offsetDate(45),
        paymentMethod: 'PayPal',
        status: 'Completed'
      },
      {
        id: 'ORD-9725',
        customer: 'Simon Riley',
        email: 'ghost@taskforce141.uk',
        product: 'Enterprise Cloud License',
        category: 'Software',
        channel: 'B2B Wholesale',
        quantity: 3,
        price: 1850.00,
        amount: 5550.00,
        date: offsetDate(50),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      },
      {
        id: 'ORD-9720',
        customer: 'Aria Stark',
        email: 'aria.stark@winterfell.net',
        product: 'Ergonomic Mesh Task Chair',
        category: 'Home & Living',
        channel: 'Online',
        quantity: 2,
        price: 450.00,
        amount: 900.00,
        date: offsetDate(60),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        id: 'ORD-9715',
        customer: 'Bruce Wayne',
        email: 'bruce@wayne-enterprises.com',
        product: 'Security Auditing Consultation',
        category: 'Services',
        channel: 'B2B Wholesale',
        quantity: 2,
        price: 3200.00,
        amount: 6400.00,
        date: offsetDate(75),
        paymentMethod: 'Wire Transfer',
        status: 'Completed'
      }
    ];
  }

  // --- App State ---
  const state = {
    sales: [],
    filteredSales: [],
    currentPeriod: 'last30',
    currentChannel: 'all',
    trendChartMetric: 'revenue', // 'revenue' or 'orders'
    tableSearch: '',
    tableStatusFilter: 'all',
    tableCategoryFilter: 'all',
    sortColumn: 'date',
    sortDirection: 'desc',
    currentPage: 1,
    rowsPerPage: 8,
    activeDeleteId: null
  };

  // --- Data Persistence Layer ---
  function loadSalesData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.sales = JSON.parse(stored);
      } else {
        state.sales = getSampleSales();
        saveSalesData();
      }
    } catch (e) {
      console.warn('LocalStorage load error, using default sample data:', e);
      state.sales = getSampleSales();
    }
  }

  function saveSalesData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sales));
    } catch (e) {
      console.error('LocalStorage save error:', e);
      showToast('Storage capacity warning or quota exceeded', 'error');
    }
  }

  // --- Date Range Filter Helper ---
  function isDateInPeriod(dateStr, period) {
    const saleDate = parseLocalDate(dateStr);
    const now = new Date();
    
    // Normalize to start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === 'all') return true;

    if (period === 'today') {
      return (
        saleDate.getFullYear() === now.getFullYear() &&
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getDate() === now.getDate()
      );
    }

    if (period === 'last7') {
      const past7 = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= past7;
    }

    if (period === 'last30') {
      const past30 = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
      return saleDate >= past30;
    }

    if (period === 'month') {
      return (
        saleDate.getFullYear() === now.getFullYear() &&
        saleDate.getMonth() === now.getMonth()
      );
    }

    if (period === 'year') {
      return saleDate.getFullYear() === now.getFullYear();
    }

    return true;
  }

  // --- Filter Core Engine ---
  function applyFilters() {
    state.filteredSales = state.sales.filter(sale => {
      // 1. Period filter
      if (!isDateInPeriod(sale.date, state.currentPeriod)) {
        return false;
      }
      // 2. Channel filter
      if (state.currentChannel !== 'all' && sale.channel !== state.currentChannel) {
        return false;
      }
      return true;
    });

    // Reset pagination to first page on filter change
    state.currentPage = 1;

    // Update all dashboard components
    updateKPIs();
    updateSidebarMilestone();
    renderTrendChart();
    renderDonutChart();
    renderChannelChart();
    renderTopProducts();
    renderTable();
  }

  // --- Currency & Number Formatting ---
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  function formatShortNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  // --- KPI Computation ---
  function updateKPIs() {
    const currentSales = state.filteredSales;

    let grossRevenue = 0;
    let completedOrders = 0;
    let totalUnits = 0;
    let maxSale = 0;
    let refundCount = 0;
    let refundValue = 0;

    currentSales.forEach(s => {
      if (s.status === 'Completed') {
        grossRevenue += s.amount;
        completedOrders += 1;
        totalUnits += (s.quantity || 1);
        if (s.amount > maxSale) maxSale = s.amount;
      } else if (s.status === 'Refunded') {
        refundCount += 1;
        refundValue += s.amount;
      }
    });

    const netRevenue = Math.max(0, grossRevenue - refundValue);
    const aov = completedOrders > 0 ? (grossRevenue / completedOrders) : 0;
    const totalOrdersAll = currentSales.length;
    const refundRate = totalOrdersAll > 0 ? ((refundCount / totalOrdersAll) * 100) : 0;
    
    // Estimated Gross Margin (standard blended retail/services SaaS model: 42.4%)
    const marginPercent = 42.4;
    const estimatedProfit = grossRevenue * (marginPercent / 100);

    // Update DOM
    document.getElementById('kpiTotalRevenue').textContent = formatCurrency(grossRevenue);
    document.getElementById('kpiNetRevenue').textContent = formatCurrency(netRevenue);
    document.getElementById('kpiTotalOrders').textContent = completedOrders.toLocaleString();
    document.getElementById('kpiTotalUnits').textContent = `${totalUnits.toLocaleString()} units`;
    document.getElementById('kpiAvgOrderValue').textContent = formatCurrency(aov);
    document.getElementById('kpiMaxSale').textContent = formatCurrency(maxSale);
    document.getElementById('kpiGrossMargin').textContent = `${marginPercent.toFixed(1)}%`;
    document.getElementById('kpiEstimatedProfit').textContent = formatCurrency(estimatedProfit);
    document.getElementById('kpiRefundRate').textContent = `${refundRate.toFixed(1)}%`;
    document.getElementById('kpiRefundCount').textContent = `${refundCount} refunded`;
    document.getElementById('kpiRefundValue').textContent = formatCurrency(refundValue);
  }

  // --- Sidebar Milestone Widget ---
  function updateSidebarMilestone() {
    // Total completed revenue across all time
    const totalAllCompleted = state.sales
      .filter(s => s.status === 'Completed')
      .reduce((sum, s) => sum + s.amount, 0);

    const percent = Math.min(100, Math.round((totalAllCompleted / REVENUE_GOAL) * 100));
    
    const fillEl = document.getElementById('sidebarProgressFill');
    const badgeEl = document.getElementById('sidebarTargetBadge');
    const currentRevEl = document.getElementById('sidebarCurrentRev');

    if (fillEl) fillEl.style.width = `${percent}%`;
    if (badgeEl) badgeEl.textContent = `${percent}%`;
    if (currentRevEl) currentRevEl.textContent = formatCurrency(totalAllCompleted);
  }

  // --- High DPI Canvas Setup Helper ---
  function setupHiDpiCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set internal canvas resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  // --- Chart 1: Revenue & Orders Velocity Trend Line / Area Chart ---
  let trendPoints = []; // Stored for interactive mouse hover tooltip

  function renderTrendChart() {
    const canvas = document.getElementById('trendChartCanvas');
    if (!canvas) return;

    const { ctx, width, height } = setupHiDpiCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    // Group sales by date
    const dailyMap = {};
    state.filteredSales.forEach(s => {
      if (s.status === 'Completed') {
        if (!dailyMap[s.date]) {
          dailyMap[s.date] = { revenue: 0, orders: 0 };
        }
        dailyMap[s.date].revenue += s.amount;
        dailyMap[s.date].orders += 1;
      }
    });

    // Sort dates ascending
    const sortedDates = Object.keys(dailyMap).sort();

    // If empty or single point, pad gracefully
    if (sortedDates.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No completed sales in selected period', width / 2, height / 2);
      trendPoints = [];
      return;
    }

    const isRevenueMode = state.trendChartMetric === 'revenue';
    const values = sortedDates.map(d => isRevenueMode ? dailyMap[d].revenue : dailyMap[d].orders);
    const maxVal = Math.max(...values, isRevenueMode ? 500 : 5);
    const minVal = 0;

    // Padding bounds
    const padTop = 30;
    const padBottom = 40;
    const padLeft = 65;
    const padRight = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Draw horizontal grid lines & Y labels
    const gridSteps = 4;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridSteps; i++) {
      const val = minVal + (maxVal - minVal) * (i / gridSteps);
      const y = padTop + chartH - (i / gridSteps) * chartH;

      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      const label = isRevenueMode ? `$${formatShortNumber(val)}` : Math.round(val).toString();
      ctx.fillText(label, padLeft - 10, y);
    }

    // Compute coordinate points
    trendPoints = sortedDates.map((date, idx) => {
      const x = sortedDates.length === 1
        ? padLeft + chartW / 2
        : padLeft + (idx / (sortedDates.length - 1)) * chartW;
      const y = padTop + chartH - ((values[idx] - minVal) / (maxVal - minVal)) * chartH;
      return {
        x,
        y,
        date,
        revenue: dailyMap[date].revenue,
        orders: dailyMap[date].orders,
        value: values[idx]
      };
    });

    // Draw Area Gradient Fill
    if (trendPoints.length > 0) {
      const primaryColor = isRevenueMode ? '#38bdf8' : '#818cf8';
      const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
      if (isRevenueMode) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      } else {
        gradient.addColorStop(0, 'rgba(129, 140, 248, 0.35)');
        gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
      }

      ctx.beginPath();
      ctx.moveTo(trendPoints[0].x, padTop + chartH);
      trendPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(trendPoints[trendPoints.length - 1].x, padTop + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Main Trend Line
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      trendPoints.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Draw Nodes / Data Points
      trendPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();
      });
    }

    // Draw X-axis Dates Labels (decimate if too many points)
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const stepSize = Math.ceil(trendPoints.length / 6);
    trendPoints.forEach((p, idx) => {
      if (idx % stepSize === 0 || idx === trendPoints.length - 1) {
        const parts = p.date.split('-');
        const shortDate = parts.length === 3 ? `${parts[1]}/${parts[2]}` : p.date;
        ctx.fillText(shortDate, p.x, padTop + chartH + 10);
      }
    });
  }

  // Mousemove crosshair and tooltip for Trend Chart
  function setupTrendChartHover() {
    const canvas = document.getElementById('trendChartCanvas');
    const tooltip = document.getElementById('trendTooltip');
    if (!canvas || !tooltip) return;

    canvas.addEventListener('mousemove', (e) => {
      if (trendPoints.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      // Find closest data point
      let closest = trendPoints[0];
      let minDistance = Math.abs(mouseX - closest.x);

      for (let i = 1; i < trendPoints.length; i++) {
        const dist = Math.abs(mouseX - trendPoints[i].x);
        if (dist < minDistance) {
          minDistance = dist;
          closest = trendPoints[i];
        }
      }

      if (minDistance < 40) {
        tooltip.innerHTML = `
          <div style="font-weight:700; color:#ffffff; margin-bottom:4px;">${formatDate(closest.date)}</div>
          <div style="color:#38bdf8; font-weight:600;">Revenue: ${formatCurrency(closest.revenue)}</div>
          <div style="color:#94a3b8; font-size:0.75rem;">Orders: ${closest.orders}</div>
        `;
        tooltip.style.left = `${closest.x}px`;
        tooltip.style.top = `${closest.y - 12}px`;
        tooltip.style.opacity = '1';
      } else {
        tooltip.style.opacity = '0';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }

  // --- Chart 2: Category Donut Chart ---
  function renderDonutChart() {
    const canvas = document.getElementById('categoryDonutCanvas');
    const legendList = document.getElementById('categoryLegendList');
    const topCatEl = document.getElementById('donutTopCategory');
    if (!canvas || !legendList) return;

    const { ctx, width, height } = setupHiDpiCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    // Sum revenue by category
    const catMap = {};
    let totalCatRevenue = 0;

    state.filteredSales.forEach(s => {
      if (s.status === 'Completed') {
        const cat = s.category || 'Other';
        catMap[cat] = (catMap[cat] || 0) + s.amount;
        totalCatRevenue += s.amount;
      }
    });

    const categories = Object.keys(catMap).sort((a, b) => catMap[b] - catMap[a]);

    // Update Top Category in Center
    if (categories.length > 0) {
      topCatEl.textContent = categories[0];
    } else {
      topCatEl.textContent = 'None';
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.65;

    legendList.innerHTML = '';

    if (totalCatRevenue === 0 || categories.length === 0) {
      // Empty ring placeholder
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      legendList.innerHTML = '<div style="color:#64748b; font-size:0.8rem; text-align:center;">No completed sales</div>';
      return;
    }

    let startAngle = -Math.PI / 2;

    categories.forEach((cat, idx) => {
      const val = catMap[cat];
      const sliceAngle = (val / totalCatRevenue) * (Math.PI * 2);
      const color = CATEGORY_COLORS[cat] || PALETTE[idx % PALETTE.length];
      const percent = ((val / totalCatRevenue) * 100).toFixed(1);

      // Draw Donut Arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Stroke separation gap
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#151d2f';
      ctx.stroke();

      startAngle += sliceAngle;

      // Populate Legend row
      const row = document.createElement('div');
      row.className = 'cat-legend-row';
      row.innerHTML = `
        <div class="cat-legend-info">
          <span class="legend-dot" style="background:${color};"></span>
          <span class="cat-legend-name">${cat}</span>
        </div>
        <div>
          <span class="cat-legend-value">${formatCurrency(val)}</span>
          <span class="cat-legend-percent">(${percent}%)</span>
        </div>
      `;
      legendList.appendChild(row);
    });
  }

  // --- Chart 3: Channel Performance Bar Chart ---
  function renderChannelChart() {
    const canvas = document.getElementById('channelBarCanvas');
    const summaryContainer = document.getElementById('channelSummaryPills');
    if (!canvas) return;

    const { ctx, width, height } = setupHiDpiCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    const channels = ['Online', 'Retail', 'B2B Wholesale', 'Affiliate'];
    const channelData = {};
    channels.forEach(ch => {
      channelData[ch] = { revenue: 0, count: 0 };
    });

    state.filteredSales.forEach(s => {
      if (s.status === 'Completed' && channelData[s.channel]) {
        channelData[s.channel].revenue += s.amount;
        channelData[s.channel].count += 1;
      }
    });

    const maxRev = Math.max(...channels.map(ch => channelData[ch].revenue), 1000);

    const padTop = 20;
    const padBottom = 40;
    const padLeft = 65;
    const padRight = 20;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Draw Gridlines
    const steps = 3;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= steps; i++) {
      const val = (maxRev / steps) * i;
      const y = padTop + chartH - (i / steps) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText(`$${formatShortNumber(val)}`, padLeft - 10, y);
    }

    // Draw Bars
    const barWidth = Math.min(50, (chartW / channels.length) * 0.55);
    const channelColors = {
      'Online': '#38bdf8',
      'Retail': '#34d399',
      'B2B Wholesale': '#818cf8',
      'Affiliate': '#fbbf24'
    };

    channels.forEach((ch, idx) => {
      const centerX = padLeft + (idx + 0.5) * (chartW / channels.length);
      const rev = channelData[ch].revenue;
      const barH = (rev / maxRev) * chartH;
      const x = centerX - barWidth / 2;
      const y = padTop + chartH - barH;

      // Draw bar background slot
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, padTop, barWidth, chartH);

      // Draw active bar with slight rounded top
      ctx.fillStyle = channelColors[ch] || '#38bdf8';
      ctx.beginPath();
      const r = Math.min(4, barH / 2);
      ctx.moveTo(x, padTop + chartH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, padTop + chartH);
      ctx.closePath();
      ctx.fill();

      // Channel X Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const label = ch === 'B2B Wholesale' ? 'B2B' : ch;
      ctx.fillText(label, centerX, padTop + chartH + 10);
    });

    // Populate channel summary pills below chart
    if (summaryContainer) {
      summaryContainer.innerHTML = channels.map(ch => {
        const d = channelData[ch];
        return `
          <div class="channel-pill">
            <div class="channel-pill-title">${ch}</div>
            <div class="channel-pill-val">${formatCurrency(d.revenue)}</div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:2px;">${d.count} sales</div>
          </div>
        `;
      }).join('');
    }
  }

  // --- Top Performing Products List ---
  function renderTopProducts() {
    const listEl = document.getElementById('topProductsList');
    if (!listEl) return;

    // Aggregate by product
    const prodMap = {};
    let totalAll = 0;

    state.filteredSales.forEach(s => {
      if (s.status === 'Completed') {
        if (!prodMap[s.product]) {
          prodMap[s.product] = {
            name: s.product,
            category: s.category,
            units: 0,
            revenue: 0
          };
        }
        prodMap[s.product].units += (s.quantity || 1);
        prodMap[s.product].revenue += s.amount;
        totalAll += s.amount;
      }
    });

    const sorted = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    if (sorted.length === 0) {
      listEl.innerHTML = '<div style="color:#64748b; font-size:0.85rem; padding: 20px; text-align:center;">No completed product sales</div>';
      return;
    }

    const maxRev = sorted[0].revenue || 1;

    listEl.innerHTML = sorted.map((p, idx) => {
      const fillPercent = Math.round((p.revenue / maxRev) * 100);
      return `
        <div class="top-product-item">
          <div class="top-product-row">
            <div class="top-product-name-wrap">
              <span class="top-product-rank">#${idx + 1}</span>
              <div>
                <div class="top-product-name">${escapeHtml(p.name)}</div>
                <div class="top-product-cat">${escapeHtml(p.category)} • ${p.units} units</div>
              </div>
            </div>
            <div class="top-product-revenue">${formatCurrency(p.revenue)}</div>
          </div>
          <div class="product-bar-bg">
            <div class="product-bar-fill" style="width: ${fillPercent}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Transactions Table & Ledger ---
  function getTableData() {
    // 1. Filter by current search and table dropdowns
    const searchLower = state.tableSearch.trim().toLowerCase();

    return state.filteredSales.filter(s => {
      // Search text match
      if (searchLower) {
        const matchesId = s.id && s.id.toLowerCase().includes(searchLower);
        const matchesCustomer = s.customer && s.customer.toLowerCase().includes(searchLower);
        const matchesProduct = s.product && s.product.toLowerCase().includes(searchLower);
        const matchesEmail = s.email && s.email.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesCustomer && !matchesProduct && !matchesEmail) {
          return false;
        }
      }

      // Status filter
      if (state.tableStatusFilter !== 'all' && s.status !== state.tableStatusFilter) {
        return false;
      }

      // Category filter
      if (state.tableCategoryFilter !== 'all' && s.category !== state.tableCategoryFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[state.sortColumn];
      let valB = b[state.sortColumn];

      if (state.sortColumn === 'amount' || state.sortColumn === 'price') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function renderTable() {
    const tableBody = document.getElementById('salesTableBody');
    const emptyState = document.getElementById('tableEmptyState');
    const rangeStart = document.getElementById('tableRangeStart');
    const rangeEnd = document.getElementById('tableRangeEnd');
    const totalRecordsEl = document.getElementById('tableTotalRecords');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageContainer = document.getElementById('pageNumbersContainer');

    if (!tableBody) return;

    const data = getTableData();
    const totalRecords = data.length;

    totalRecordsEl.textContent = totalRecords.toLocaleString();

    if (totalRecords === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      rangeStart.textContent = '0';
      rangeEnd.textContent = '0';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      pageContainer.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';

    // Pagination bounds
    const totalPages = Math.ceil(totalRecords / state.rowsPerPage);
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    if (state.currentPage < 1) state.currentPage = 1;

    const startIndex = (state.currentPage - 1) * state.rowsPerPage;
    const endIndex = Math.min(startIndex + state.rowsPerPage, totalRecords);
    const pageRecords = data.slice(startIndex, endIndex);

    rangeStart.textContent = (startIndex + 1).toString();
    rangeEnd.textContent = endIndex.toString();

    // Render Table Rows
    tableBody.innerHTML = pageRecords.map(sale => {
      const statusClass = 
        sale.status === 'Completed' ? 'badge-completed' :
        sale.status === 'Pending' ? 'badge-pending' : 'badge-refunded';

      return `
        <tr data-sale-id="${escapeHtml(sale.id)}">
          <td><span class="order-id-badge">${escapeHtml(sale.id)}</span></td>
          <td>${formatDate(sale.date)}</td>
          <td>
            <div class="customer-name">${escapeHtml(sale.customer || 'Guest')}</div>
            <div class="customer-email">${escapeHtml(sale.email || 'N/A')}</div>
          </td>
          <td>
            <div class="product-cell-name">${escapeHtml(sale.product)}</div>
            <div class="product-cell-meta">${escapeHtml(sale.category)} • Qty: ${sale.quantity || 1}</div>
          </td>
          <td><span class="badge badge-channel">${escapeHtml(sale.channel)}</span></td>
          <td class="text-right amount-cell">${formatCurrency(sale.amount)}</td>
          <td class="text-center">
            <span class="badge ${statusClass}">${escapeHtml(sale.status)}</span>
          </td>
          <td class="text-center">
            <div class="row-actions">
              <button type="button" class="btn-icon btn-edit-sale" data-id="${escapeHtml(sale.id)}" title="Edit transaction">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-icon btn-icon-delete btn-delete-sale" data-id="${escapeHtml(sale.id)}" title="Delete sale">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Pagination buttons state
    prevBtn.disabled = state.currentPage <= 1;
    nextBtn.disabled = state.currentPage >= totalPages;

    // Render Page Number Buttons
    pageContainer.innerHTML = '';
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 6 && Math.abs(p - state.currentPage) > 2 && p !== 1 && p !== totalPages) {
        continue;
      }
      const pBtn = document.createElement('button');
      pBtn.type = 'button';
      pBtn.className = `page-num-btn ${p === state.currentPage ? 'active' : ''}`;
      pBtn.textContent = p.toString();
      pBtn.addEventListener('click', () => {
        state.currentPage = p;
        renderTable();
      });
      pageContainer.appendChild(pBtn);
    }

    // Attach row action listeners
    attachTableRowActions();
  }

  function attachTableRowActions() {
    document.querySelectorAll('.btn-edit-sale').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditSaleModal(id);
      });
    });

    document.querySelectorAll('.btn-delete-sale').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        promptDeleteSale(id);
      });
    });
  }

  // --- Modal Management ---
  const saleModal = document.getElementById('saleModal');
  const saleForm = document.getElementById('saleForm');
  const confirmModal = document.getElementById('confirmModal');

  function openNewSaleModal() {
    document.getElementById('modalTitle').textContent = 'Record New Sale';
    document.getElementById('saleFormEditId').value = '';
    saleForm.reset();

    // Default to today's date
    const todayStr = formatLocalDateString(new Date());
    document.getElementById('saleDate').value = todayStr;
    document.getElementById('saleQuantity').value = 1;
    document.getElementById('salePrice').value = '';
    document.getElementById('saleTotalDisplay').value = '$0.00';

    saleModal.classList.add('open');
    saleModal.setAttribute('aria-hidden', 'false');
    document.getElementById('saleCustomer').focus();
  }

  function openEditSaleModal(saleId) {
    const sale = state.sales.find(s => s.id === saleId);
    if (!sale) return;

    document.getElementById('modalTitle').textContent = `Edit Transaction #${sale.id}`;
    document.getElementById('saleFormEditId').value = sale.id;

    document.getElementById('saleCustomer').value = sale.customer || '';
    document.getElementById('saleEmail').value = sale.email || '';
    document.getElementById('saleProduct').value = sale.product || '';
    document.getElementById('saleCategory').value = sale.category || 'Electronics';
    document.getElementById('saleChannel').value = sale.channel || 'Online';
    document.getElementById('salePaymentMethod').value = sale.paymentMethod || 'Credit Card';
    document.getElementById('saleQuantity').value = sale.quantity || 1;
    document.getElementById('salePrice').value = sale.price || (sale.amount / (sale.quantity || 1));
    document.getElementById('saleDate').value = sale.date || '';
    document.getElementById('saleStatus').value = sale.status || 'Completed';

    updateCalculatedTotal();

    saleModal.classList.add('open');
    saleModal.setAttribute('aria-hidden', 'false');
  }

  function closeSaleModal() {
    saleModal.classList.remove('open');
    saleModal.setAttribute('aria-hidden', 'true');
  }

  function updateCalculatedTotal() {
    const qty = parseFloat(document.getElementById('saleQuantity').value) || 0;
    const price = parseFloat(document.getElementById('salePrice').value) || 0;
    const total = qty * price;
    document.getElementById('saleTotalDisplay').value = formatCurrency(total);
  }

  function handleSaleFormSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('saleFormEditId').value;
    const customer = document.getElementById('saleCustomer').value.trim();
    const email = document.getElementById('saleEmail').value.trim();
    const product = document.getElementById('saleProduct').value.trim();
    const category = document.getElementById('saleCategory').value;
    const channel = document.getElementById('saleChannel').value;
    const paymentMethod = document.getElementById('salePaymentMethod').value;
    const quantity = parseInt(document.getElementById('saleQuantity').value, 10) || 1;
    const price = parseFloat(document.getElementById('salePrice').value) || 0;
    const date = document.getElementById('saleDate').value;
    const status = document.getElementById('saleStatus').value;

    if (!customer || !product || price <= 0 || !date) {
      showToast('Please fill in all required fields with valid values', 'error');
      return;
    }

    const amount = parseFloat((quantity * price).toFixed(2));

    if (editId) {
      // Update existing
      const index = state.sales.findIndex(s => s.id === editId);
      if (index !== -1) {
        state.sales[index] = {
          ...state.sales[index],
          customer,
          email,
          product,
          category,
          channel,
          paymentMethod,
          quantity,
          price,
          amount,
          date,
          status
        };
        saveSalesData();
        applyFilters();
        showToast(`Transaction #${editId} updated successfully`, 'success');
      }
    } else {
      // Generate new sequential ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `ORD-${randomNum}`;

      const newSale = {
        id: newId,
        customer,
        email,
        product,
        category,
        channel,
        paymentMethod,
        quantity,
        price,
        amount,
        date,
        status
      };

      state.sales.unshift(newSale); // add to beginning
      saveSalesData();
      applyFilters();
      showToast(`New sale #${newId} recorded successfully`, 'success');
    }

    closeSaleModal();
  }

  // --- Deletion Flow ---
  function promptDeleteSale(saleId) {
    state.activeDeleteId = saleId;
    const messageEl = document.getElementById('confirmModalMessage');
    messageEl.textContent = `Are you sure you want to delete transaction #${saleId}? This cannot be undone.`;
    confirmModal.classList.add('open');
  }

  function handleConfirmAction() {
    if (state.activeDeleteId === '__ALL__') {
      state.sales = [];
      saveSalesData();
      applyFilters();
      showToast('All transaction records wiped', 'info');
    } else if (state.activeDeleteId) {
      const deletedId = state.activeDeleteId;
      state.sales = state.sales.filter(s => s.id !== deletedId);
      saveSalesData();
      applyFilters();
      showToast(`Transaction #${deletedId} removed`, 'info');
    }
    state.activeDeleteId = null;
    confirmModal.classList.remove('open');
  }

  function closeConfirmModal() {
    state.activeDeleteId = null;
    confirmModal.classList.remove('open');
  }

  // --- CSV Export Helper ---
  function exportSalesToCsv() {
    if (state.filteredSales.length === 0) {
      showToast('No sales data available to export', 'error');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Product', 'Category', 'Sales Channel', 'Payment Method', 'Quantity', 'Unit Price', 'Total Amount', 'Status'];

    const rows = state.filteredSales.map(s => [
      `"${(s.id || '').replace(/"/g, '""')}"`,
      `"${s.date || ''}"`,
      `"${(s.customer || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.product || '').replace(/"/g, '""')}"`,
      `"${(s.category || '').replace(/"/g, '""')}"`,
      `"${(s.channel || '').replace(/"/g, '""')}"`,
      `"${(s.paymentMethod || '').replace(/"/g, '""')}"`,
      s.quantity || 1,
      s.price || 0,
      s.amount || 0,
      `"${(s.status || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_analytics_${formatLocalDateString(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Sales data successfully exported to CSV', 'success');
  }

  // --- Toast Notification System ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<span style="color:#10b981; font-weight:bold;">✓</span>';
    } else if (type === 'error') {
      iconSvg = '<span style="color:#ef4444; font-weight:bold;">✕</span>';
    } else {
      iconSvg = '<span style="color:#38bdf8; font-weight:bold;">ℹ</span>';
    }

    toast.innerHTML = `${iconSvg} <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 3200);
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Debounce helper
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // --- Setup Global Event Listeners ---
  function setupEventListeners() {
    // 1. Period Selector
    const periodSelect = document.getElementById('timeRangeSelect');
    if (periodSelect) {
      periodSelect.addEventListener('change', (e) => {
        state.currentPeriod = e.target.value;
        applyFilters();
      });
    }

    // 2. Channel Filter Selector
    const channelSelect = document.getElementById('channelFilterSelect');
    if (channelSelect) {
      channelSelect.addEventListener('change', (e) => {
        state.currentChannel = e.target.value;
        applyFilters();
      });
    }

    // 3. Trend Metric Toggles
    const toggleRevBtn = document.getElementById('toggleRevenueBtn');
    const toggleOrdersBtn = document.getElementById('toggleOrdersBtn');
    if (toggleRevBtn && toggleOrdersBtn) {
      toggleRevBtn.addEventListener('click', () => {
        toggleRevBtn.classList.add('active');
        toggleOrdersBtn.classList.remove('active');
        state.trendChartMetric = 'revenue';
        renderTrendChart();
      });

      toggleOrdersBtn.addEventListener('click', () => {
        toggleOrdersBtn.classList.add('active');
        toggleRevBtn.classList.remove('active');
        state.trendChartMetric = 'orders';
        renderTrendChart();
      });
    }

    // 4. Modal Open & Close Triggers
    const openAddBtn = document.getElementById('openAddModalBtn');
    const closeAddBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    if (openAddBtn) openAddBtn.addEventListener('click', openNewSaleModal);
    if (closeAddBtn) closeAddBtn.addEventListener('click', closeSaleModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeSaleModal);

    // Close modal when clicking outside backdrop
    if (saleModal) {
      saleModal.addEventListener('click', (e) => {
        if (e.target === saleModal) closeSaleModal();
      });
    }

    // 5. Quantity & Price dynamic total calculation
    const qtyInput = document.getElementById('saleQuantity');
    const priceInput = document.getElementById('salePrice');
    if (qtyInput) qtyInput.addEventListener('input', updateCalculatedTotal);
    if (priceInput) priceInput.addEventListener('input', updateCalculatedTotal);

    // 6. Form Submission
    if (saleForm) {
      saleForm.addEventListener('submit', handleSaleFormSubmit);
    }

    // 7. Confirm Modal Actions
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
    const actionConfirmBtn = document.getElementById('actionConfirmBtn');

    if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
    if (actionConfirmBtn) actionConfirmBtn.addEventListener('click', handleConfirmAction);

    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
      });
    }

    // 8. Table Filters & Search
    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        state.tableSearch = e.target.value;
        state.currentPage = 1;
        renderTable();
      }, 200));
    }

    const tableStatusFilter = document.getElementById('tableStatusFilter');
    if (tableStatusFilter) {
      tableStatusFilter.addEventListener('change', (e) => {
        state.tableStatusFilter = e.target.value;
        state.currentPage = 1;
        renderTable();
      });
    }

    const tableCatFilter = document.getElementById('tableCategoryFilter');
    if (tableCatFilter) {
      tableCatFilter.addEventListener('change', (e) => {
        state.tableCategoryFilter = e.target.value;
        state.currentPage = 1;
        renderTable();
      });
    }

    // 9. Table Column Sorting
    const sortHeaders = document.querySelectorAll('.sales-table th[data-sort]');
    sortHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (state.sortColumn === col) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortColumn = col;
          state.sortDirection = col === 'amount' || col === 'date' ? 'desc' : 'asc';
        }

        // Update header carets
        sortHeaders.forEach(h => {
          const caret = h.querySelector('.sort-caret');
          if (caret) caret.textContent = '';
        });
        const currentCaret = th.querySelector('.sort-caret');
        if (currentCaret) {
          currentCaret.textContent = state.sortDirection === 'asc' ? '▲' : '▼';
        }

        renderTable();
      });
    });

    // 10. Table Pagination Buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
          state.currentPage--;
          renderTable();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.currentPage++;
        renderTable();
      });
    }

    // 11. Export to CSV Button
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportSalesToCsv);

    // 12. Reset Demo Data Button
    const resetBtn = document.getElementById('resetSampleDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.sales = getSampleSales();
        saveSalesData();
        applyFilters();
        showToast('Sample dataset restored', 'success');
      });
    }

    // 13. Clear All Data Button
    const clearBtn = document.getElementById('clearAllDataBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.activeDeleteId = '__ALL__';
        const messageEl = document.getElementById('confirmModalMessage');
        messageEl.textContent = 'Are you sure you want to wipe ALL transactions from Web Storage? This cannot be undone.';
        confirmModal.classList.add('open');
      });
    }

    // 14. Responsive Window Resize Handler for Canvas
    window.addEventListener('resize', debounce(() => {
      renderTrendChart();
      renderDonutChart();
      renderChannelChart();
    }, 150));

    // 15. Setup trend chart interactive mousemove
    setupTrendChartHover();
  }

  // --- Initialization ---
  function init() {
    loadSalesData();
    setupEventListeners();
    applyFilters();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
