import React from 'react';
import { injectIntl } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

class SafeHTMLMessage extends React.Component {
  render () {
    const {intl, id, values, tagName} = this.props;
    const msg = intl.formatHTMLMessage({id}, values);
    const options = {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'span' ],
      allowedAttributes: {
        'a': [ 'href' ],
        '*': [ 'alt', 'class' ]
      }
    }
    return React.createElement(tagName || 'span', {dangerouslySetInnerHTML:{ __html: sanitizeHtml(msg, options)}}, null);
  }
}
export default injectIntl(SafeHTMLMessage);
