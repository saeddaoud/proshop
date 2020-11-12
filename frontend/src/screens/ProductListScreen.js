import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  const { error, loading, products, page, pages } = useSelector(
    (state) => state.productList
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const {
    error: errorDelete,
    loading: loadingDelete,
    success: successDelete,
  } = useSelector((state) => state.productDelete);
  const {
    error: errorCreate,
    loading: loadingCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((state) => state.productCreate);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    userInfo,
    history,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteProductHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className='align-item-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table responsive bordered hover striped className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={userInfo.isAdmin} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
