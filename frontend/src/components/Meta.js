import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, keywords, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome to ProShop',
  description: 'Best products with cheap prices',
  keywords: 'electronics, buy electronics, sell electronics',
};

export default Meta;
