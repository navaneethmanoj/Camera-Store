import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getCategory, updateCategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    loading: false,
    error: "",
    updatedCategory: "",
    getaRedirect: false,
  });

  //TODO Redirect assignment
  const { name, loading, error, updatedCategory, getaRedirect } = values;
  const { user, token } = isAuthenticated();

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateCategory(match.params.categoryId, user._id, token, {name}).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            loading: false,
            error: "",
            updatedCategory: data.name,
          });
        }
      }
    );
  };
  const handleChange = name => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: updatedCategory ? "" : "none" }}
    >
      <h4>{updatedCategory} updated successfully</h4>
    </div>
  );
  const errorMessage = () => (
    <div
      className="alert alert-danger mt-3"
      style={{ display: error ? "" : "none" }}
    >
      <h4>{error}</h4>
    </div>
  );
  const goBack = () => (
    <div className="mt-5">
      <Link to="/admin/categories" className="btn btn-sm btn-dark mb-3">
        Go Back
      </Link>
    </div>
  );
  const addCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="">Enter the Category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange("name")}
          value={name}
          autoFocus
          required
          placeholder="For eg. Lens Filter"
        />
        <button onClick={onSubmit} className="btn btn-outline-success">
          Update Category
        </button>
      </div>
    </form>
  );
  return (
    <Base title="Add Product" description="" className="container bg-info p-4">
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {addCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
