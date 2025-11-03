import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, query, orderBy, limit, where, collection, collectionData, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);

  // items$;
  // items;

  // unSubList;
  // unSubSingle;

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  unsubTrash;
  unsubNote;
  unsubMarked;

  constructor() {

    this.unsubTrash = this.subTrashList()
    this.unsubNote = this.subNotesList()
    this.unsubMarked = this.subMakredNotesList()
    // this.items$ = collectionData(this.getNotesRef())
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // });

  }

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => {
        console.log(err);
      }
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {
          console.log(err);
        }
      ).then();
    }
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  // colID sagt mir ob trash oder notes

  // async addNote(item: Note, colId: "notes" | "trash") {
  //   await addDoc(this.getNotesRef(), item).catch(
  //     (err) => { console.error(err) }
  //   ).then(
  //     (docRef) => { console.log("Document written with ID: ", docRef?.id, 'and', colId); }
  //   )
  // }

  async addNote(item: Note, colId: "notes" | "trash") {
    if (colId == "notes") {
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.error(err) }
      ).then(
        (docRef) => { console.log("Document written with ID: ", docRef?.id, 'aollte in notes landen ->', colId); }
      )
    } else {
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.error(err) }
      )
      console.log("sollte in trash landen ->", colId);
    }
  }

  ngonDestroy() {
    this.unsubTrash();
    this.unsubTrash();
    // this.items.unsubscribe();
  }

  setNoteObject(obj: any, id: string,): Note {
    {
      return {
        id: id,
        type: obj.type || 'note',
        title: obj.title || '',
        content: obj.content || '',
        marked: obj.marked || false
      }
    }
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    // let ref = collection(this.firestore, "notes/VD0YBb9DkgY2SaIq72M3/notesExtras") So kann ich auch auf Collections(Sammlungen) in Unterordner zugreifen.
    const q = query(this.getNotesRef(), orderBy("title"), limit(100));
    // const q = query(ref, limit(100)); für die option mit ref oben
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      // änderng und modifizierung der Liste beobachten
  //     list.docChanges().forEach((change) => {
  //   if (change.type === "added") {
  //       console.log("New note: ", change.doc.data());
  //   }
  //   if (change.type === "modified") {
  //       console.log("Modified note: ", change.doc.data());
  //   }
  //   if (change.type === "removed") {
  //       console.log("Removed note: ", change.doc.data());
  //   }
  // });
    });
  }

  subMakredNotesList() {
    const q = query(this.getNotesRef(), where('marked', '==', true), limit(100));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach(element => {
        this.markedNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getNotesRef() {
    return collection(this.firestore, 'notes'
    )
  }

  getTrashRef() {
    return collection(this.firestore, 'trash'
    )
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

}