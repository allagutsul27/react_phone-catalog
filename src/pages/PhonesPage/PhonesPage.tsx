import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { Product } from '../../types/Product';
import { getPhones } from '../../utils/getProducts';
import { ProductsList } from '../../components/ProductsList';
import { Loader } from '../../components/Loader';
import { Dropdown } from '../../components/Dropdown';
import { getPreparedProducts } from '../../utils/getPrepareProducts';
import { DropdownPagination } from '../../components/DropdownPagination';
import { Pagination } from '../../components/Pagination';
import { getNumbers } from '../../utils/getNumbers';
import { NoResults } from '../../components/NoResults';

export const PhonesPage = () => {
  const [phones, setPhones] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const sort = searchParams.get('sort') || '';
  const perPage = searchParams.get('perPage') || 'all';
  const currentPage = +(searchParams.get('page') || '1');

  useEffect(() => {
    setIsLoading(true);
    getPhones()
      .then(setPhones)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (phones.length > 0) {
    let pages: number[] | undefined;

    if (phones && perPage && perPage !== 'all') {
      pages = getNumbers(1, Math.ceil(phones.length / +perPage));
    } else {
      pages = getNumbers(1, 1);
    }

    const firstItem = (currentPage - 1) * +perPage;

    const lastItem = firstItem + +perPage > phones.length
      ? phones.length
      : firstItem + +perPage;

    const preparedProducts = getPreparedProducts(
      phones, { sort },
    );

    return (
      <div className="phonespage">
        <div className="container">

          <BreadCrumbs />

          <h1 className="title rainbow-text phonespage__title">
            Mobile Phones
          </h1>
          <span className="phonespage__quantity">
            {phones.length}
            {' '}
            models
          </span>
          <div className="phonespage__dropdowns">
            <Dropdown initialValue={sort} />
            <DropdownPagination initialValue={perPage} />
          </div>

          <div className="phonespage__productslist">
            <ProductsList products={perPage === 'all'
              ? preparedProducts
              : preparedProducts.slice(firstItem, lastItem)}
            />
          </div>

          <Pagination pages={pages} />
        </div>
      </div>
    );
  }

  return (
    <NoResults />
  );
};
