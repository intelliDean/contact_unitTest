// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Todo {

    TodoStruct[] private todos;

    struct TodoStruct {
        string title;
        string description;
        bool isDone;
    }

    modifier notOutOfBound(uint _index) {
        require(_index >= 0 && _index <= todos.length, "Index out of bound");
        _;
    }

    function createTodo(string calldata _title, string calldata _description) external {
        todos.push(
            TodoStruct( _title, _description, false)
        );
    }

    function getTodo(uint _index) public view notOutOfBound(_index) returns(TodoStruct memory) {
        return todos[_index];
    }

    function changeStatus(uint _index) external notOutOfBound(_index) {
        TodoStruct storage  todo = todos[_index];
        if (todo.isDone == false) {
            todo.isDone = true;
        } else {
            todo.isDone = false;
        }
    }

    function getStatus(uint _index) external view notOutOfBound(_index) returns(bool) {
        return getTodo(_index).isDone;
    }

    function deleteTodo(uint _index)  external notOutOfBound(_index) {
        delete todos[_index];
    }
}
