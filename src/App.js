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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function App() {
  /*Setting Hooks*/
  const [ToDos, setToDos] = useState([]);
  const [todo, setTodo] = useState("");
  const [EditToDo, setEditToDo] = useState(null);
  const [EditText, setEditText] = useState("");

  /*Functions to Handle Changes and submits*/
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todo.length < 1) {
      alert("Can't Add Empty Item");
    } else {
      const newToDo = {
        id: new Date().getTime(),
        text: todo,
        completed: false,
      };
      setToDos([...ToDos].concat(newToDo));
      setTodo("");
    }
  };

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
    <Center
      w="100%"
      minH="100vh"
      bg="grey"
      p={3}
      bgGradient="linear(to-l, #7928CA, #FF0080)"
    >
      <Box
        w="35em"
        minH="35em"
        justifyContent="center"
        textAlign="center"
        bgGradient="linear(to-r, red.500, yellow.500)"
        borderRadius="lg"
      >
        <Text color="white" fontSize="2em" fontWeight="700" pt={3}>
          To-Do List
        </Text>
        {/*Form To Add a new task */}
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Input
              variant="outline"
              placeholder="Add a new item..."
              size="md"
              w="80%"
              borderWidth="0.1em"
              color="white"
              mt={3}
              onChange={handleChange}
              value={todo}
            />
          </FormControl>
          <Button
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            size="md"
            type="submit"
            mt={3}
            w="80%"
            color="white"
            fontWeight="700"
            _hover={{
              bgGradient: "linear(to-l, #7928CA, #FF0080)",
              color: "white",
              textDecoration: "underline",
            }}
            onClick={handleSubmit}
          >
            Add Item
          </Button>
        </form>

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
                    color="white"
                    mt={3}
                    onChange={(e) => {
                      setEditText(e.target.value);
                    }}
                    value={EditText}
                  />
                  <Button
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    size="md"
                    type="submit"
                    w="20%"
                    color="white"
                    fontWeight="700"
                    ml={2}
                    _hover={{
                      bgGradient: "linear(to-l, #7928CA, #FF0080)",
                      color: "white",
                      textDecoration: "underline",
                    }}
                    onClick={() => updateTodo(Todo.id)}
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <div>
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
                        fontSize="1.5em"
                        color="white"
                        fontWeight="500"
                        pl={1}
                        pr={1}
                        textAlign="justify"
                        style={
                          Todo.completed
                            ? {
                                color: "#d4cdcd",
                                textDecoration: "line-through",
                              }
                            : null
                        }
                      >

                        {Todo.text}
                      </Text>
                    </Box>

                    <Box display="flex" w="15%">
                      <Button
                        variant="unstyled"
                        onClick={() => {
                          setEditToDo(Todo.id);
                          setEditText(Todo.text);
                        }}
                      >
                        <EditIcon color="blue" fontSize="1.5em" ml={0} />
                      </Button>

                      <Button
                        variant="unstyled"
                        onClick={() => deleteTodo(Todo.id)}
                      >
                        <DeleteIcon color="red" fontSize="1.5em" ml={0} />
                      </Button>
                    </Box>
                  </Box>
                </div>
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Center>
  );
}
