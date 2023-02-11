const { nanoid } = require("nanoid")
const notes = require("./notes")

const addNoteHandler = (request, h) => {
    // membuat objek yang berisi pesan dari klien
    const { title, tags, body } = request.payload;
    // karena membutuhkan id, maka kita menggunakan fungsi nanoid untuk membuat id acak
    const id = nanoid(16);
    // membuat tanggal kapan dibuat dan dirubah
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    // membuat objek berisi semua yang akan diterima server
    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };
    notes.push(newNote);// memasukkan data kedalam array file notes.js
    const isSucces = notes.filter((note) => note.id === id).length > 0; // memfilter array berdasarkan data id
    if (isSucces) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            },
        });
        response.code(201);
        return response;
    };
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};
// fungsi untuk menampilkan seluruh catatan yang telah dibuat
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },

})
// fungsi untuk menampilkan catatan yang dipilih berdasarkan id
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0]; // memfilter id berdasarkan index
    // mengecek apakah ada atau tidak ada
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};
// membuat fungsi edit berdasarkan catatan yang dipilih oleh id
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            // menggunakan spread operator agar nilai yang lain tidak perlu diubah atau nilai lama
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
// membuat fungsi untuk menghapus catatan
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler
}