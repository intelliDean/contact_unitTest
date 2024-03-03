// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Todo {
    //Array to store todo struct
    TodoStruct[] private todos;

    //Struct of todo
    struct TodoStruct {
        string title;
        string description;
        bool isDone;
    }

    //modifier to make sure index is not out of bound
    modifier notOutOfBound(uint _index) {
        require(_index >= 0 && _index <= todos.length, "Index out of bound");
        _;
    }

    //function to create todo
    function createTodo(string calldata _title, string calldata _description) external {
        todos.push(
            TodoStruct( _title, _description, false)
        );
    }

    //function to get saved todo
    function getTodo(uint _index) public view notOutOfBound(_index) returns(TodoStruct memory) {
        return todos[_index];
    }

    //function to change todo status
    function changeStatus(uint _index) external notOutOfBound(_index) {
        TodoStruct storage  todo = todos[_index];
        todo.isDone== false ? todo.isDone = true : todo.isDone = false;
    }

    //function to get todo status
    function getStatus(uint _index) external view notOutOfBound(_index) returns(bool) {
        return getTodo(_index).isDone;
    }

    //function to delete/remove todo
    function deleteTodo(uint _index)  external notOutOfBound(_index) {
        delete todos[_index];
    }

    //function to update todo title
    function updateTitle(uint _index, string calldata _title) external notOutOfBound(_index){
        todos[_index].title = _title;
    }

    //function to get todo title
    function getTitle(uint _index) external view notOutOfBound(_index) returns(string memory) {
        return getTodo(_index).title;
    }

    //function to update todo description
    function updateDescription(uint _index, string memory _description) external notOutOfBound(_index) {
        todos[_index].description = _description;
    }

    //function to get todo description
    function getDescription(uint _index) external view notOutOfBound(_index) returns(string memory) {
        return getTodo(_index).description;
    }

    //function to get the size of the todo list
    function getArraySize() external view returns(uint) {
        return todos.length;
    }
}