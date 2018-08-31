# react-intl-safe-html
Sanitized HTML component

Usage:

```
import SafeHTMLMessage from 'react-intl-safe-html';
...
<SafeHTMLMessage id="test" />
```

Example translations/en.json:

```
{
  "test": "hello <b>world</b>",
}
```

By default, `react-intl` will escape HTML in strings to protect the user from dangerous HTML (`script` tags). The `SafeHTMLMessage` component sanitizes HTML strings for safe presentation.

### Inline styles

Inline CSS cannot be sanitized, so it is not an allowed attribute. For example, `<span style="color:red">blah</span`. 

> The style attribute and style tags should be consolidated into external stylesheets to protect against a variety of surprisingly clever data exfiltration methods that CSS enables.
> -- [Web Fundamentals tutorial](https://developers.google.com/web/fundamentals/security/csp/)

Put CSS in its own file (e.g. `About.css`) and reference the class in JavaScript:

```
<SafeHTMLMessage id='stripes-core.about.example' values={{ className: css.isEmptyMessage }} />
```

translations/en.json:

```
{
  "stripes-core.about.example": "Here is some <span class='{className}'>gray text</span>.",
}
```
