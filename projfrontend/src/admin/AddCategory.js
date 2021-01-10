import React,{useState} from "react";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => (
      <div className="mt-5">
          <Link to="/admin/dashboard" className="btn btn-sm btn-dark mb-3">
            Admin Home
          </Link>
      </div>
  )
  
  const handleChange = event => {
    setError("")
    setName(event.target.value)
  }
  const onSubmit = event => {
      event.preventDefault()
      setError("")
      setSuccess(false)
      createCategory(user._id, token, {name})
      .then(data => {
          if(data.error){
              setError(true)
          } else {
              setError("")
              setSuccess(true)
              setName("")
          }
      })
  }

  const successMessage = () => {
        if(success){
            return <h4 className="text-success">Category created successfully</h4>
        }
  }
  const errorMessage = () => {
        if(error){
            return <h4 className="text-danger">Error in creating Category</h4>
        }
  }
  const addCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="">Enter the Category</p>
        <input type="text" className="form-control my-3" onChange={handleChange} value={name} autoFocus required placeholder="For eg. Lens Filter"/>
        <button onClick={onSubmit} className="btn btn-outline-success">Add Category</button>
      </div>
    </form>
  );

  return (
    <Base
      title="Create Category"
      description="Add a new category for products here"
      className="container bg-success p-4"
    >
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

export default AddCategory;
