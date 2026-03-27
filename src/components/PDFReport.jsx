const escapePdfText = (text) => {
    return String(text ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
};

const normalizePdfText = (text) => {
    // Keep only basic ASCII to avoid font/encoding issues in a hand-made PDF.
    return String(text ?? '')
        .replace(/Đ/g, 'D')
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return '--';
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '--';
    }
    return date.toLocaleDateString('vi-VN');
};

const formatNumber = (value) => {
    const num = Number(value ?? 0);
    if (Number.isNaN(num)) {
        return '0';
    }
    return num.toLocaleString('vi-VN');
};

const toPdfBytes = (content) => {
    const bytes = [];
    for (let i = 0; i < content.length; i += 1) {
        bytes.push(content.charCodeAt(i) & 0xff);
    }
    return new Uint8Array(bytes);
};

const truncateText = (text, maxChars) => {
    const safeText = normalizePdfText(text || '--');
    if (safeText.length <= maxChars) {
        return safeText;
    }
    return `${safeText.slice(0, Math.max(0, maxChars - 3))}...`;
};

const getTimeFilterLabel = (timeFilter) => {
    const value = String(timeFilter || '').toLowerCase();
    switch (value) {
        case 'day':
            return 'Theo ngay';
        case 'week':
            return 'Theo tuan';
        case 'month':
            return 'Theo thang';
        case 'year':
            return 'Theo nam';
        default:
            return normalizePdfText(timeFilter || 'Theo thang');
    }
};

export const getEnterpriseFallbackRows = () => {
    return [
        {
            wasteType: 'Nhua',
            area: 'Phuong 1',
            weightKg: 38,
            status: 'Da thu gom',
            date: new Date()
        },
        {
            wasteType: 'Giay',
            area: 'Phuong 2',
            weightKg: 21,
            status: 'Da thu gom',
            date: new Date(Date.now() - 86400000)
        },
        {
            wasteType: 'Kim loai',
            area: 'Phuong 3',
            weightKg: 15,
            status: 'Da thu gom',
            date: new Date(Date.now() - 172800000)
        }
    ];
};

export const downloadEnterprisePdfReport = (reportPayload = {}) => {
    const {
        generatedAt = new Date(),
        filters = {},
        summary = {},
        rows = []
    } = reportPayload;

    const safeRows = (rows || []).slice(0, 12);
    const tableRows = safeRows.length ? safeRows : getEnterpriseFallbackRows();

    const contentCommands = ['0.8 w', '0 0 0 RG'];
    const pushText = (x, y, text, size = 11) => {
        const safeText = escapePdfText(normalizePdfText(text));
        contentCommands.push(`BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${safeText}) Tj ET`);
    };
    const drawLine = (x1, y1, x2, y2) => {
        contentCommands.push(`${x1} ${y1} m ${x2} ${y2} l S`);
    };
    const drawRect = (x, y, width, height) => {
        contentCommands.push(`${x} ${y} ${width} ${height} re S`);
    };

    // Header
    pushText(40, 805, 'BAO CAO THONG KE DOANH NGHIEP - ECOCOLLECT', 16);
    pushText(40, 784, `Ngay xuat bao cao: ${formatDate(generatedAt)}`, 11);
    drawLine(40, 775, 555, 775);

    // Filter block
    drawRect(40, 665, 515, 95);
    pushText(50, 742, 'THONG TIN BO LOC', 12);
    pushText(50, 722, `Kieu loc thoi gian: ${getTimeFilterLabel(filters.timeFilter)}`, 10);
    pushText(50, 706, `Tu ngay: ${filters.startDate || '--'}`, 10);
    pushText(290, 706, `Den ngay: ${filters.endDate || '--'}`, 10);
    pushText(50, 690, `Loai rac: ${filters.wasteType || 'Tat ca loai'}`, 10);
    pushText(290, 690, `Khu vuc: ${filters.area || 'Tat ca khu vuc'}`, 10);

    // Summary block
    drawRect(40, 565, 515, 85);
    pushText(50, 628, 'TONG QUAN', 12);
    pushText(50, 608, `Tong bao cao da nhan: ${formatNumber(summary.totalReportsReceived)}`, 10);
    pushText(290, 608, `Tong khoi luong tai che (kg): ${formatNumber(summary.totalRecycled)}`, 10);
    pushText(50, 592, `Tong bao cao hoan thanh: ${formatNumber(summary.totalReportsCompleted)}`, 10);
    pushText(290, 592, `So loai rac tiep nhan: ${formatNumber(summary.totalAcceptedWasteCategories)}`, 10);

    // Details title
    pushText(40, 540, 'CHI TIET BAO CAO', 12);

    // Table layout
    const tableX = 30;
    const tableTop = 525;
    const rowHeight = 20;
    const columns = [
        { key: 'index', title: 'STT', width: 35 },
        { key: 'wasteType', title: 'Loai rac', width: 100 },
        { key: 'area', title: 'Khu vuc / Dia diem', width: 170 },
        { key: 'weightKg', title: 'KL (kg)', width: 60 },
        { key: 'status', title: 'Trang thai', width: 95 },
        { key: 'date', title: 'Ngay', width: 75 }
    ];
    const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const totalRows = tableRows.length + 1; // header + data
    const tableHeight = rowHeight * totalRows;
    const tableBottom = tableTop - tableHeight;

    drawRect(tableX, tableBottom, tableWidth, tableHeight);

    // Horizontal lines
    for (let i = 1; i < totalRows; i += 1) {
        const y = tableTop - i * rowHeight;
        drawLine(tableX, y, tableX + tableWidth, y);
    }

    // Vertical lines
    let currentX = tableX;
    columns.forEach((col, colIndex) => {
        currentX += col.width;
        if (colIndex < columns.length - 1) {
            drawLine(currentX, tableTop, currentX, tableBottom);
        }
    });

    // Header row text
    let headerX = tableX + 4;
    columns.forEach((col) => {
        pushText(headerX, tableTop - 14, col.title, 9);
        headerX += col.width;
    });

    // Data rows text
    tableRows.forEach((row, rowIndex) => {
        const y = tableTop - rowHeight * (rowIndex + 1) - 14;
        const rowData = {
            index: `${rowIndex + 1}`,
            wasteType: truncateText(row.wasteType, 18),
            area: truncateText(row.area, 34),
            weightKg: formatNumber(row.weightKg),
            status: truncateText(row.status, 16),
            date: formatDate(row.date)
        };

        let cellX = tableX + 4;
        columns.forEach((col) => {
            pushText(cellX, y, rowData[col.key], 9);
            cellX += col.width;
        });
    });

    // Footer
    const footerText = safeRows.length
        ? 'Du lieu chi tiet duoc trich tu danh sach bao cao da thu gom.'
        : 'Khong co du lieu thu gom. Da su dung du lieu mau de xuat PDF.';
    pushText(40, 40, footerText, 9);

    const contentStream = contentCommands.join('\n');
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
        '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
        `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj) => {
        offsets.push(pdf.length);
        pdf += obj;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i += 1) {
        pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const blob = new Blob([toPdfBytes(pdf)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateLabel = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `enterprise-report-${dateLabel}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
