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
import logo from './logo.png';
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

export default function App() {
  /*Setting Hooks*/
  const [ToDos, setToDos] = useState([]);
  const [todo, setTodo] = useState("");
  const [EditToDo, setEditToDo] = useState(null);
  const [EditText, setEditText] = useState("");

  useEffect(() => {
    const Temp = JSON.parse(localStorage.getItem("todos"));
    setToDos(Temp);
  }, []);
  /*Functions to Handle Changes and submits*/
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
      await setToDos([...ToDos].concat(newToDo));
      setTodo("");
    }
  };
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(ToDos));
  });

  function deleteTodo(id) {
    const updatedToDos = [...ToDos].filter((todo) => todo.id !== id);
    setToDos(updatedToDos);
  }

  function toggleComplete(id) {
    const updatedToDos = [...ToDos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setToDos(updatedToDos);
  }
  function updateTodo(id) {
    const updatedToDos = [...ToDos].map((todo) => {
      if (todo.id === id) {
        todo.text = EditText;
      }
      return todo;
    });
    setToDos(updatedToDos);
    setEditText("");
    setEditToDo("");
  }

  return (
    <Center w="100%" minH="100vh" bg="grey" p={3}>
      <div className="left"></div>
      <div className="right"></div>
      <img className="logo" src={logo}></img>
      {/*  */}
      <div className="c-div">
        <div className="hello"></div>

        <Box
          w="35em"
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
            fontSize="2em"
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
              size="md"
              type="submit"
              mt={3}
              w="20%"
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

                      <Box display="flex" w="10%">
                        <Button
                          variant="unstyled"
                          onClick={() => {
                            setEditToDo(Todo.id);
                            setEditText(Todo.text);
                          }}
                        >
                          <EditIcon
                            color="#560AA2"
                            fontSize="1.5em"
                            ml={0}
                          />
                        </Button>

                        <Button
                          variant="unstyled"
                          onClick={() => deleteTodo(Todo.id)}
                        >
                          <DeleteIcon
                            color="#C71350"
                            fontSize="1.5em"
                            ml={0}
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
  );
}
