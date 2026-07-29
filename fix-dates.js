/* eslint-disable */
const fs = require('fs');

function replaceDates(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Farm context logic
    if (filePath.includes('farm-context.tsx')) {
        content = content.replace(/toLocaleDateString\('en-US'/g, "toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage");
        // defaultDemoUser is outside the context, so currentLanguage isn't available there.
        // Let's replace only instances where currentLanguage is in scope, or just use 'en-US' for the default user
        // wait, let's just use i18n.language globally!
        content = original.replace(/toLocaleDateString\('en-US'/g, "toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language");
        content = content.replace(/toLocaleDateString\(\)/g, "toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)");
    } 
    // Reports and Calendar logic
    else {
        content = content.replace(/toLocaleDateString\('en-US'/g, "toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language");
        content = content.replace(/toLocaleDateString\(\)/g, "toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)");
        // Add import i18n if it doesn't exist
        if (!content.includes("import i18n")) {
            content = "import i18n from '@/i18n';\n" + content;
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed dates in ' + filePath);
    }
}

replaceDates('c:\\Users\\91630\\OneDrive\\Desktop\\CropNexa\\src\\context\\farm-context.tsx');
replaceDates('c:\\Users\\91630\\OneDrive\\Desktop\\CropNexa\\src\\components\\reports.tsx');
replaceDates('c:\\Users\\91630\\OneDrive\\Desktop\\CropNexa\\src\\components\\calendar.tsx');
