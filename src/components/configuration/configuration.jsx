import React from "react";

const Configuration = () => {
  return (
    <div>
      <form className="form">
        <h2 className="font-semibold text-2xl text-black">
          Update Your Store With Odoo
        </h2>
        <div>
          <div className="text-black text-sm font-normal mb-2 mt-4">
            Odoo url
          </div>
          <input
            type="text"
            name="odooUrl"
            placeholder="Write your odoo url"
            className="auth-input"
            required
          />
        </div>
        <div>
          <div className="text-black text-sm font-normal mb-2 mt-2">
            DB Name
          </div>
          <input
            type="text"
            name="dbName"
            placeholder="Write your database name"
            className="auth-input"
            required
          />
        </div>
        <div>
          <div className="text-black text-sm font-normal mb-2 mt-2">
            Username
          </div>
          <input
            type="text"
            name="userName"
            placeholder="Write your username"
            className="auth-input"
            required
          />
        </div>
        <div>
          <div className="text-black text-sm font-normal mb-2 mt-2">
            Password
          </div>
          <input
            type="password"
            name="password"
            placeholder="Write your password"
            className="auth-input"
            required
          />
        </div>
        <button type="submit" className="auth-button mt-3">
          Update your store
        </button>
      </form>
    </div>
  );
};
export default Configuration;
