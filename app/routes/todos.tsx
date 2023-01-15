import { Outlet, useTransition, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';

import { TrashIcon } from '@heroicons/react/24/outline';

import { db } from '~/utils/db.server';

export const loader = async () => {
  try {
    const todos = await db.todo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return json({
      todos
    });
  } catch (err) {
    let message = 'There has been a problem';

    if (err instanceof Error) {
      message = err.message;
    }

    throw new Error(message);
  }
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const _action = form.get('_action');

  console.log('_action', _action);
  console.log('log', request.method);

  switch (_action) {
    case 'delete': {
      console.log('_action is delete');
      const id = form.get('id');

      // we do this type check to be extra sure and to make TypeScript happy
      if (typeof id !== 'string') {
        throw new Error(`Form not submitted correctly.`);
      }

      const todoToDelete = await db.todo.findUnique({
        where: { id }
      });

      if (!todoToDelete) {
        throw new Response("Can't delete what does not exist", {
          status: 404
        });
      }

      await db.todo.delete({ where: { id } });

      return null;
    }
    case 'create': {
      console.log('here');
      const description = form.get('description');

      // we do this type check to be extra sure and to make TypeScript happy
      if (typeof description !== 'string') {
        throw new Error(`Form not submitted correctly.`);
      }

      const fields = { description };

      const todo = await db.todo.create({ data: fields });

      return json({
        todo
      });
    }

    default: {
      console.log(`_action ${_action} is not defined`);
      null;
    }
  }
};

export default function TodosRoute() {
  const data = useLoaderData<typeof loader>();
  const transition = useTransition();

  console.log('transition', transition);

  return (
    <div className="container prose mx-auto pt-8">
      <h1>TODOS🤪</h1>
      <main>
        <ul className="list-none pl-0">
          {data.todos.map((todo) => (
            <li key={todo.id} className="flex justify-between">
              <div className="flex">
                <form method="put" className="mr-2">
                  <input type="checkbox" name="completed"></input>
                </form>
                <div>{todo.description}</div>
              </div>
              <form method="post">
                <input type="hidden" name="id" value={todo.id} />
                <button type="submit" name="_action" value="delete">
                  <TrashIcon className="h-4 w-4 text-[#636065]" />
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form method="post" className="py-4">
          <div>
            <label htmlFor="todo" className="block text-sm font-medium text-gray-700">
              Add todo
            </label>
            <div className="mt-2 flex gap-4">
              <input
                type="text"
                name="description"
                className="block w-full rounded-md border border-gray-300 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder=""
              />
              <button
                type="submit"
                className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                name="_action"
                value="create"
              >
                Add
              </button>
            </div>
          </div>
        </form>
        <Outlet />
      </main>
    </div>
  );
}
