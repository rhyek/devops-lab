package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"encoding/json"
)

type TeamMember struct {
	Id int `json:"id"`
	Name string `json:"name"`
}

type TeamMembers []TeamMember;

var (
	teamMembers = TeamMembers {
		TeamMember { Id: 2, Name: "Carlos" },
	}
)

func status(w http.ResponseWriter, r *http.Request) {
	fmt.Println("/")
	fmt.Fprint(w, "Hello, world!")
}

func getAll(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(teamMembers)
}

func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", status).Methods("GET")
	router.HandleFunc("/team-members/status", status).Methods("GET")
	router.HandleFunc("/team-members/", getAll).Methods("GET")
	port := 3002
	fmt.Println("Listening on port", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), router))
}

func main() {
	handleRequests()
}
