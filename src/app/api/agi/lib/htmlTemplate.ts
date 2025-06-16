export interface ImageConfig {
    text: string;
    width: number;
    height: number;
    bgColor: string;
    textColor: string;
    fontSize: string;
    customCSS?: string;
    layout?: "center" | "left" | "right";
}

// HTML 模板字符串，避免文件读取问题
export const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Image</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { 
      margin: 0; 
      padding: 0; 
      font-family: 'Inter', sans-serif;
    }
    {{customCSS}}
  </style>
</head>
<body>
  <div class="w-full h-screen {{bgColor}} {{layoutClasses}} p-8">
    <div class="max-w-4xl {{textAlign}}">
      <h1 class="{{fontSize}} {{textColor}} font-bold leading-tight break-words">
        {{text}}
      </h1>
      <div class="mt-8 {{textColor}} opacity-70">
        <div class="w-16 h-1 bg-current {{decorationAlign}} mb-4 rounded"></div>
        <p class="text-sm">Generated with AGI Printer</p>
      </div>
    </div>
  </div>
</body>
</html>`;

export function generateHTML(config: ImageConfig): string {
    // 根据布局设置相关的 CSS 类
    const layoutClasses = {
        center: "flex items-center justify-center",
        left: "flex items-center justify-start",
        right: "flex items-center justify-end",
    };

    const textAlign = {
        center: "text-center",
        left: "text-left",
        right: "text-right",
    };

    const decorationAlign = {
        center: "mx-auto",
        left: "mr-auto",
        right: "ml-auto",
    };

    // 替换模板中的变量
    return HTML_TEMPLATE
        .replace(/\{\{text\}\}/g, config.text)
        .replace(/\{\{bgColor\}\}/g, config.bgColor)
        .replace(/\{\{textColor\}\}/g, config.textColor)
        .replace(/\{\{fontSize\}\}/g, config.fontSize)
        .replace(
            /\{\{layoutClasses\}\}/g,
            layoutClasses[config.layout || "center"],
        )
        .replace(/\{\{textAlign\}\}/g, textAlign[config.layout || "center"])
        .replace(
            /\{\{decorationAlign\}\}/g,
            decorationAlign[config.layout || "center"],
        )
        .replace(/\{\{customCSS\}\}/g, config.customCSS || "");
}
