import React from "react";
import ReactDom from "react-dom/client":
import "./Registen.css";
// Register page: plain React (no JSX), so it runs by simply opening index.html.
(function () {
  var h = React.createElement;
  var useState = React.useState;

  function Field(props) {
    return h(
      "div",
      { className: "field" },
      h("label", { htmlFor: props.id }, props.label),
      h("input", {
        id: props.id,
        name: props.id,
        type: props.type || "text",
        value: props.value,
        onChange: props.onChange,
        autoComplete: props.autoComplete,
        "aria-invalid": props.error ? "true" : "false",
        className: props.error ? "has-error" : ""
      }),
      props.error ? h("p", { className: "error" }, props.error) : null
    );
  }

  function RegisterPage() {
    var initial = { firstName: "", lastName: "", email: "", password: "" };
    var _v = useState(initial), values = _v[0], setValues = _v[1];
    var _n = useState(false), newsletter = _n[0], setNewsletter = _n[1];
    var _e = useState({}), errors = _e[0], setErrors = _e[1];
    var _d = useState(false), done = _d[0], setDone = _d[1];

    function update(key) {
      return function (e) {
        var next = Object.assign({}, values);
        next[key] = e.target.value;
        setValues(next);
      };
    }

    function validate() {
      var err = {};
      if (!values.firstName.trim()) err.firstName = "Enter your first name.";
      if (!values.lastName.trim()) err.lastName = "Enter your last name.";
      if (!/^\S+@\S+\.\S+$/.test(values.email)) err.email = "Enter a valid email address.";
      if (values.password.length < 8) err.password = "Use at least 8 characters.";
      return err;
    }

    function handleSubmit(e) {
      e.preventDefault();
      var err = validate();
      setErrors(err);
      if (Object.keys(err).length === 0) {
        // Replace this with your real API call.
        console.log("Register:", values, { newsletter: newsletter });
        setDone(true);
      }
    }

    if (done) {
      return h(
        "main",
        { className: "page" },
        h(
          "section",
          { className: "card" },
          h("h1", null, "Account created"),
          h("p", { className: "login-text" }, "Welcome, " + values.firstName + ". You can now ",
            h("a", { href: "#login" }, "log in"), ".")
        )
      );
    }

    return h(
      "main",
      { className: "page" },
      h(
        "section",
        { className: "card" },
        h("h1", null, "Create an account"),
        h(
          "form",
          { onSubmit: handleSubmit, noValidate: true },
          h(
            "div",
            { className: "row" },
            h(Field, { id: "firstName", label: "First Name", value: values.firstName, onChange: update("firstName"), error: errors.firstName, autoComplete: "given-name" }),
            h(Field, { id: "lastName", label: "Last Name", value: values.lastName, onChange: update("lastName"), error: errors.lastName, autoComplete: "family-name" })
          ),
          h(Field, { id: "email", label: "Email", type: "email", value: values.email, onChange: update("email"), error: errors.email, autoComplete: "email" }),
          h(Field, { id: "password", label: "Password", type: "password", value: values.password, onChange: update("password"), error: errors.password, autoComplete: "new-password" }),
          h(
            "label",
            { className: "checkbox", htmlFor: "newsletter" },
            h("input", {
              id: "newsletter",
              type: "checkbox",
              checked: newsletter,
              onChange: function (e) { setNewsletter(e.target.checked); }
            }),
            h("span", null, "Sign up for our newsletter")
          ),
          h("button", { type: "submit", className: "register-btn" }, "REGISTER"),
          h(
            "p",
            { className: "login-text" },
            "Already have an account? ",
            h("a", { href: "#login" }, "Login Here")
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(RegisterPage));
})();
