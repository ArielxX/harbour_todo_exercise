"use client";

import Link from "next/link";
import classNames from "classnames";
import { CreateList } from "@/components/CreateList";
import { randomColor } from "@/utils/randomColor";
import { useState } from "react";
import { Close } from "./icons/Close";
import { gql } from "graphql-request";
import { client } from "@/lib/client";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

type MyListsProps = {
  list: TodoList[];
};

const DELETE_TODO_LIST_MUTATION = gql`
  mutation deleteTODOList($id: Int!) {
    deleteTODOList(id: $id)
  }
`;

export const MyLists = ({ list = [] }: MyListsProps) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>(list);
  const constraintsRef = useRef(null);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = async (id: number) => {
    // TODO: delete list with query
    // Update state with new list
    const res = await client.request<{ deleteTODOList: boolean }>(
      DELETE_TODO_LIST_MUTATION,
      {
        id: id,
      }
    );

    if (res.deleteTODOList) {
      setTodoLists(todoLists.filter((item) => item.id !== id));
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-8 text-center"
        ref={constraintsRef}
      >
        <h1 className="text-4xl">
          {todoLists.length > 0 ? "My TODO lists" : "No lists yet!"}
        </h1>
        <ul>
          {todoLists.map((item) => (
            <>
              <AnimatePresence initial={false}>
                <motion.div layout drag dragConstraints={constraintsRef}>
                  <li key={item.id}>
                    <div className="flex justify-between items-center">
                      <p className="white">Drag</p>
                      <Link
                        href={item.id.toString()}
                        className={classNames(
                          "py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out",
                          randomColor()
                        )}
                        style={{ width: "80%" }}
                      >
                        {item.name}
                      </Link>
                      <button
                        className="btn btn-square btn-error"
                        onClick={() => onDeletedHandler(item.id)}
                      >
                        <Close />
                      </button>
                    </div>
                  </li>
                </motion.div>
              </AnimatePresence>
            </>
          ))}
        </ul>
        <CreateList onCreate={onCreateHandler} />
      </motion.div>
    </>
  );
};
