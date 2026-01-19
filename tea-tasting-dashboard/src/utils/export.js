export const exportToPDF = (entries) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text("Tea Tasting Journal", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const tableColumn = ["Date", "Name", "Type", "Origin", "Rating", "Notes"];
    const tableRows = [];

    entries.forEach(entry => {
        const teaData = [
            entry.date,
            entry.name,
            entry.type,
            entry.origin,
            entry.rating + '/5',
            entry.notes
        ];
        tableRows.push(teaData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [141, 163, 153] }, // Sage Green
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 25 }, // Date
            1: { cellWidth: 30 }, // Name
            2: { cellWidth: 20 }, // Type
            3: { cellWidth: 25 }, // Origin
            4: { cellWidth: 15 }, // Rating
            5: { cellWidth: 'auto' } // Notes
        }
    });

    doc.save("tea-journal.pdf");
};
