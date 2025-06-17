import { useCallback } from "react";

export function usePrint() {
    const handlePrint = useCallback(() => {
        const printContent = document.getElementById("print-area");
        if (!printContent) return;

        // 创建一个新窗口用于打印
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        // 复制当前页面的样式
        const styles = Array.from(document.styleSheets)
            .map((styleSheet) => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map((rule) => rule.cssText)
                        .join("");
                } catch (e) {
                    console.log("Error accessing stylesheet:", e);
                    return "";
                }
            })
            .join("");

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Content</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 0; }
              .print-area { 
                width: 210mm !important; 
                height: 297mm !important; 
                margin: 0 auto !important;
                transform: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();

        // 等待样式加载完成后打印
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }, []);

    return { handlePrint };
}
