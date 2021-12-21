import "./App.css";
import {
  Box,
  Button,
  Center,
  Text,
  FormControl,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import logo from "./logo.png";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function App() {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [ToDos, setToDos] = useState([]);
  const [todo, setTodo] = useState("");
  const [EditToDo, setEditToDo] = useState(null);
  const [EditText, setEditText] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [suError, setSUError] = useState(false);
  const [suSucess, setSUSuccess] = useState(false);
  const [suMsg, setSUMsg] = useState("");
  const [logError, setLogError] = useState(false);
  const [logSucess, setLogSuccess] = useState(false);
  const [logMsg, setLogMsg] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [logToggle, setLogToggle] = useState(false);

  const url = "https://todo-suryaansh.herokuapp.com";

  function handleLogin() {
    const data = {
      email,
      password,
    };
    axios
      .post(url + "/api/auth/login", data)
      .then((res) =>
        res.data.status === "email error"
          ? (console.log(res.data.error),
            setLogMsg(res.data.error),
            setEmailErr(true),
            setPassErr(false))
          : res.data.status === "pass error"
          ? (console.log(res.data.error),
            setLogMsg(res.data.error),
            setEmailErr(false),
            setPassErr(true))
          : res.data.status === "success"
          ? (setCookie("user", res.data.data),
            setLogError(false),
            setEmailErr(false),
            setPassErr(false),
            setLogSuccess(true),
            setLogMsg("Logged in successfully"),
            setToDos(res.data.data.todos),
            window.location.reload(),
            setTimeout("window.location.reload()", 2000))
          : null
      )
      .catch((err) => console.log(err.message));
  }
  function handleSignup() {
    const data = {
      name,
      email,
      password,
    };
    axios
      .post(url + "/api/auth/signup", data)
      .then((res) =>
        res.data.status === "name error"
          ? (setSUMsg(res.data.error),
            setNameErr(true),
            setEmailErr(false),
            setPassErr(false))
          : res.data.status === "email error"
          ? (setSUMsg(res.data.error),
            setEmailErr(true),
            setNameErr(false),
            setPassErr(false))
          : res.data.status === "pass error"
          ? (setSUMsg(res.data.error),
            setPassErr(true),
            setNameErr(false),
            setEmailErr(false))
          : res.data.status === "success"
          ? (setSUError(false),
            setPassErr(false),
            setNameErr(false),
            setEmailErr(false),
            setSUSuccess(true),
            setSUMsg("Signed Up Successfully!"),
            setCookie("user", res.data.data))
          : null
      )
      .catch((err) => console.log(err.message));
  }

  useEffect(() => {
    if (cookie.user) {
      const email = cookie.user.email;
      axios
        .post(url + "/api/auth/get", { email })
        .then((res) => (setCookie("user", res.data), setToDos(res.data.todos)));
      console.log(cookie.user);
    } else {
      const Temp = JSON.parse(localStorage.getItem("todos"));
      setToDos(Temp);
      console.log(Temp);
    }
  }, []);
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todo.length < 1) {
      alert("Can't Add Empty Item");
    } else {
      const newToDo = {
        id: new Date().getTime(),
        text: todo,
        completed: false,
      };
      if (cookie.user) {
        const updatedTodos = [...ToDos].concat(newToDo);
        const data = { updatedTodos, id: cookie.user._id };
        console.log(data);
        axios
          .post(url + "/api/auth/update", data)
          .then((res) => setCookie("user", res.data));

        console.log(cookie.user);
      }

      await setToDos([...ToDos].concat(newToDo));
      setTodo("");
    }
  };
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(ToDos));
  });

  function deleteTodo(id) {
    const updatedTodos = [...ToDos].filter((todo) => todo.id !== id);
    if (cookie.user) {
      const data = { updatedTodos, id: cookie.user._id };
      console.log(data);
      axios
        .post(url + "/api/auth/update", data)
        .then((res) => setCookie("user", res.data));

      console.log(cookie.user);
    }

    setToDos(updatedTodos);
  }

  function toggleComplete(id) {
    const updatedTodos = [...ToDos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    if (cookie.user) {
      const data = { updatedTodos, id: cookie.user._id };
      console.log(data);
      axios
        .post(url + "/api/auth/update", data)
        .then((res) => setCookie("user", res.data));

      console.log(cookie.user);
    }

    setToDos(updatedTodos);
  }
  function updateTodo(id) {
    const updatedTodos = [...ToDos].map((todo) => {
      if (todo.id === id) {
        todo.text = EditText;
      }
      return todo;
    });
    if (cookie.user) {
      const data = { updatedTodos, id: cookie.user._id };
      console.log(data);
      axios
        .post(url + "/api/auth/update", data)
        .then((res) => setCookie("user", res.data));

      console.log(cookie.user);
    }

    setToDos(updatedTodos);
    setEditText("");
    setEditToDo("");
  }

  const handleLogout = async () => {
    await removeCookie("user");
    setToDos([]);
    localStorage.setItem("todos", JSON.stringify(ToDos));

    try {
      window.location.reload();
    } catch (error) {}
  };

  return (
    <>
      {cookie.user ? (
        <button
          id="launch-login"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          id="launch-login"
          data-toggle="modal"
          data-target="#logModal"
        >
         Sign Up for a better Experience!
        </button>
      )}
      <div
        class="modal fade"
        id="logModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="logModal"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">

          {logToggle ? (
            <div class="modal-content">
            <div className="right2"></div>
            <div className="left2"></div>
              <br />
              <h5 class="modal-title" id="exampleModalLongTitle">
                Login
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="modal-body">
                {logSucess && logMsg != "" ? (
                  <div className="success">{logMsg}</div>
                ) : null}

                <form className="form-contact" method="POST" name="myForm">
                  {/* <div className="form-label">
                <label>Email:</label>
              </div> */}
                  <div className="input-div">
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    {emailErr && logMsg != "" ? (
                      <div className="error">{logMsg}</div>
                    ) : null}
                  </div>
                  {/* <div className="form-label">
                <label>Password:</label>
              </div> */}
                  <div className="input-div">
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    {passErr && logMsg != "" ? (
                      <div className="error">{logMsg}</div>
                    ) : null}
                  </div>
                  <div className="submit-c">
                    <button
                      className="submit-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogin();
                      }}
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="modal-link-c">
                  New here?{" "}
                  <a className="" onClick={() => setLogToggle(false)}>
                    <span className="modal-link">Register Now!</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div class="modal-content">
            <div className="right2"></div>
            <div className="left2"></div>

              <br />
              <h5 class="modal-title" id="exampleModalLongTitle">
                Sign Up
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="modal-body">
                {suSucess && suMsg != "" ? (
                  <div className="success">{suMsg}</div>
                ) : null}

                <form className="form-contact" method="POST">
                  <div className="input-div">
                    <input
                      className="form-input"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                    {nameErr && suMsg != "" ? (
                      <div className="error">{suMsg}</div>
                    ) : null}
                  </div>

                  <div className="input-div">
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    {emailErr && suMsg != "" ? (
                      <div className="error">{suMsg}</div>
                    ) : null}
                  </div>

                  <div className="input-div">
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    {passErr && suMsg != "" ? (
                      <div className="error">{suMsg}</div>
                    ) : null}
                  </div>
                  <div className="submit-c">
                    <button
                      className="submit-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignup();
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <div className="modal-link-c">
                  Already a user?{" "}
                  <a className="" onClick={() => setLogToggle(true)}>
                    <span className="modal-link">Login Now!</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Center w="100%" minH="100vh" bg="grey" className="cc" p={3}>
        <div className="left"></div>
        <div className="right"></div>
        <img className="logo" src={logo}></img>
        {/*  */}
        <div className="c-div">
          <div className="hello"></div>

          <Box
            minH="25em"
            justifyContent="center"
            textAlign="center"
            zIndex={10}
            borderRadius="lg"
            className="main-box"
          >
            <Text
              color="black"
              className="font"
              
              fontWeight="700"
              pt={3}
            >
              TO-DO LIST
            </Text>

            <form onSubmit={handleSubmit}>
              <FormControl>
                <Input
                  variant="outline"
                  placeholder="Add a new item..."
                  size="md"
                  w="80%"
                  color="black"
                  mt={3}
                  onChange={handleChange}
                  display="inline"
                  value={todo}
                  borderColor="rgb(0, 0, 0,0.3)"
                  borderWidth="0.5px"
                />
              </FormControl>
              <Button
                type="submit"
                mt={3}
                w="30%"
                fontWeight="700"
                id="sub-btn"
                onClick={handleSubmit}
              >
                Add Item
              </Button>
            </form>

            {/*Form To Add a new task */}

            {/*Container for all To Do Items, mapping through ToDos */}
            <Box mt={10}>
              {ToDos.map((Todo) => (
                <div>
                  {/*Ternary Operator to check whether to render the todo item or to render update code for Todo Item */}
                  {EditToDo === Todo.id ? (
                    <div>
                      <Input
                        variant="outline"
                        size="md"
                        w="60%"
                        borderWidth="0.1em"
                        color="black"
                        mt={3}
                        onChange={(e) => {
                          setEditText(e.target.value);
                        }}
                        value={EditText}
                      />
                      <Button
                        size="md"
                        type="submit"
                        w="20%"
                        fontWeight="700"
                        ml={2}
                        onClick={() => updateTodo(Todo.id)}
                        id="sub-btn"
                      >
                        Update
                      </Button>
                    </div>
                  ) : (
                    <div className="todo">
                      {" "}
                      <Box key={Todo.id} display="flex" ml={10}>
                        <Box display="flex" w="85%">
                          <Checkbox
                            onChange={() => toggleComplete(Todo.id)}
                            size="md"
                            colorScheme="green"
                            isChecked={Todo.completed}
                          >
                            {" "}
                          </Checkbox>
                          <Text
                            fontWeight="500"
                            pl={1}
                            pr={1}
                            mt={1}
                            className="font2"
                            textAlign="justify"
                            style={
                              Todo.completed
                                ? {
                                    color: "rgb(0,0,0,0.4)",
                                    textDecoration: "line-through",
                                  }
                                : null
                            }
                          >
                            {Todo.text}
                          </Text>
                        </Box>

                        <Box display="flex" className="icon-box">
                          <Button
                            variant="unstyled"
                            onClick={() => {
                              setEditToDo(Todo.id);
                              setEditText(Todo.text);
                            }}
                          >
                            <EditIcon color="#560AA2" className="list-icon"  ml={0} />
                          </Button>

                          <Button
                            variant="unstyled"
                            onClick={() => deleteTodo(Todo.id)}
                          >
                            <DeleteIcon
                              color="#C71350"
                              ml={0}
                              className="list-icon"
                            />
                          </Button>
                        </Box>
                      </Box>
                    </div>
                  )}
                </div>
              ))}
            </Box>
          </Box>
        </div>
      </Center>
    </>
  );
}
