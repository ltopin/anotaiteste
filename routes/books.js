const router = express.Router();
var booksModel = require("../models/bookModel");

//mantive a mesma estrtura que foi passada aqui, eu costumo criar toda a lógica das funções dentro dos services e vou chamando as funções aqui nos routes
//no entanto conforme o primeiro exemplo imagino que vcs trabalhem diferente, então mantive esse padrão.

router.get("/", (req, res) => {
  //Crie aqui a função para listar todos os livros cadastrados na estrutura (models/bookModel) do mongodb
  booksModel.find({}).exec((err, books) => {
    if (err) return helper.error(res, "Erro ao receber os dados do banco");

    return res.json({ books, success: true });
  });
});

router.put("/:id", (req, res) => {
  //Crie aqui a função para atualizar os dados de um livro com base no id do mesmo
  booksModel.findOneAndUpdate(
    { _id: req.params.id },

    {
      title: req.body.title,
      category: req.body.category,
      pageCount: req.body.pageCount,
      publishedDate: req.body.publishedDate,
      thumbnailUrl: req.body.thumbnailUrl,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
    },
    (err, book) => {
      if (err || !book) return helper.error(res, "Não foi possível atualizar");

      return res.json({
        success: true,
        message: "Livro atualizado com sucesso",
      });
    }
  );
});

router.post("/", (req, res) => {
  //Crie aqui a função para cadastrar os dados de um livro
  const criaLivro = new booksModel(req.body);
  criaLivro.save((err) => {
    if (err)
      return helper.error(res, "Não foi possível cadastrar novo livro " + err);

    return res.json({
      success: true,
      message: "Livro cadastrado com Sucesso ! ",
    });
  });
});

router.delete("/", (req, res) => {
  //essa função de deletar eu faria por uma flag direto no model e utilizando o findOneAndUpdate, criaria um campo deleted: false no model e dava um update pra deleted: true
  //(e todas as listagens teriam que chamar um deleted: false como parâmetro tb)

  //Crie aqui a função para remover os dados de um livro

  booksModel
    .deleteOne({
      _id: req.params.id,
    })
    .exec((err, books) => {
      if (err) return helper.error(res, "Não foi possível deletar");
      if (!books)
        return helper.error(
          res,
          "Não foi possível deletar, livro não encontrado"
        );

      return res.json({
        books,
        success: true,
        message: "Livro deletado com Sucesso ! ",
      });
    });
});

module.exports = router;
