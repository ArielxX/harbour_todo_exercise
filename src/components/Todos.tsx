"use client";

import { useRef, useState } from "react";
import { Heart } from "@/components/icons/Heart";
import { Close } from "@/components/icons/Close";
import { AddTodo } from "@/components/AddTodo";
import { gql } from "graphql-request";
import { client } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO_MUTATION = gql`
  mutation addTODO($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
      created_at
      desc
      todo_list_id
      finished
    }
  }
`;

const REMOVE_TODO_MUTATION = gql`
  mutation removeTODO($id: Int!, $listId: Int!) {
    removeTODO(id: $id, listId: $listId)
  }
`;

const FINISH_TODO_MUTATION = gql`
  mutation finishTODO($id: Int!, $listId: Int!) {
    finishTODO(id: $id, listId: $listId) {
      id
      created_at
      desc
      todo_list_id
      finished
    }
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);
  const constraintsRef = useRef(null);

  const onAddHandler = async (desc: string) => {
    const res = await client.request<{ addTODO: Todo }>(ADD_TODO_MUTATION, {
      listId: listId,
      desc: desc,
    });

    setTodos([...todos, { id: res.addTODO.id, desc, finished: false }]);

    console.log(`Add todo ${desc}`);
  };

  const onRemoveHandler = async (id: number) => {
    const res = await client.request<{ removeTODO: boolean }>(
      REMOVE_TODO_MUTATION,
      {
        id: id,
        listId: listId,
      }
    );

    if (!res) {
      return;
    }

    const todos2 = todos.filter((item) => item.id !== id);
    setTodos(todos2);
    console.log(`Remove todo ${id}`);
  };

  const onFinishHandler = async (id: number) => {
    const res = await client.request<{ finishTODO: Todo }>(
      FINISH_TODO_MUTATION,
      {
        id: id,
        listId: listId,
      }
    );

    const todos2 = todos.map((item) => {
      if (item.id === id) {
        return { ...item, finished: res.finishTODO.finished };
      }
      return item;
    });
    setTodos(todos2);
    console.log(`Mark todo ${id} as finished`);
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-8 text-center"
        ref={constraintsRef}
      >
        <h2 className="text-center text-5xl mb-10">My TODO list</h2>
        <ul>
          {todos.map((item) => (
            <>
              <AnimatePresence initial={false}>
                <motion.div layout drag dragConstraints={constraintsRef}>
                  <li
                    key={item.id}
                    className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
                  >
                    <p className={item.finished ? "line-through" : ""}>
                      {item.desc}
                    </p>
                    {!item.finished && (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-square btn-accent"
                          onClick={() => onFinishHandler(item.id)}
                        >
                          <Heart />
                        </button>
                        <button
                          className="btn btn-square btn-error"
                          onClick={() => onRemoveHandler(item.id)}
                        >
                          <Close />
                        </button>
                      </div>
                    )}
                  </li>
                </motion.div>
              </AnimatePresence>
            </>
          ))}
        </ul>
        <AddTodo onAdd={onAddHandler} />
      </motion.div>
    </>
  );
};
