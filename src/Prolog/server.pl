:- module(echo_server,
  [ start_server/0,
    stop_server/0
  ]
).

:- include('chat_bot.pl').
:- include('IA.pl').

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_files)).
:- use_module(library(http/websocket)).

:- http_handler(root(.),
                http_reply_from_files('../../src/', []),
                [prefix]).
:- http_handler(root(echo),
                http_upgrade_to_websocket(echo, []),
                [spawn([])]).
:- http_handler(root(ia),
                http_upgrade_to_websocket(handle_ia_messages, []),
                [spawn([])]).

start_server :-
    default_port(Port),
    start_server(Port).
start_server(Port) :-
    http_server(http_dispatch, [port(Port)]).

stop_server() :-
    default_port(Port),
    stop_server(Port).
stop_server(Port) :-
    http_stop_server(Port, []).

default_port(3000).

echo(WebSocket) :-
    ws_receive(WebSocket, Message, [format(json)]),
    ( Message.opcode == close
    -> true
    ; get_response(Message.data, Response),
      ws_send(WebSocket, json(Response)),
      echo(WebSocket)
    ).

get_response(Message, Response) :-
  produire_reponse(Message.message, Prod_Response, Autre_Rep),
  (Prod_Response = 0 ->
    Response = _{message:Autre_Rep}
    ;
    Response = _{message:Prod_Response}
    ).

handle_ia_messages(WebSocket) :-
    ws_receive(WebSocket, Message, [format(json)]),
   ( Message.opcode == close
    -> true
    ; process_ia_message(Message.data, Response),
      ws_send(WebSocket, json(Response)),
      handle_ia_messages(WebSocket)
   ).

