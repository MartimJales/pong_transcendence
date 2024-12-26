# pong_transcendence
This project is about creating a website for the mighty Pong contest

```mermaid
graph TD
    A[Início] --> B[Página Inicial]
    B --> C{Usuário Logado?}
    C -->|Não| D[Login/Registro]
    C -->|Sim| E[Dashboard do Usuário]
    D --> E
    D --> D1[Query: Registro]
    D1[/"INSERT INTO users
    (username, email, password_hash)
    VALUES (?, ?, ?)"/]
    E --> F[Jogar]
    E --> G[Torneios]
    E --> H[Ver Estatísticas]
    E --> T[Perfil do Usuário]
    F --> I[Modo de Jogo - AI, 2P, 4P]
    I --> J[Jogo Casual]
    I --> K[Jogo Ranqueado]
    I --> I1[Query: Obter Modos]
    I1[/"SELECT * FROM game_modes"/]
    J --> Q[Fim do Jogo]
    K --> Q
    Q --> Q1[Query: Fim de Jogo]
    Q1[/"UPDATE matches SET end_time = CURRENT_TIMESTAMP WHERE match_id = ?;
    INSERT INTO match_participants (match_id, user_id, score) VALUES (?, ?, ?);
    UPDATE user_stats SET total_matches = total_matches + 1, ... WHERE user_id = ?"/]
    G --> L[Lista de Torneios]
    L --> L1[Query: Listar Torneios]
    L1[/"SELECT * FROM tournaments"/]
    L --> N[Participar do Torneio]
    N --> N1[Query: Participar]
    N1[/"INSERT INTO tournament_participants
    (tournament_id, user_id) VALUES (?, ?)"/]
    H --> O[Estatísticas Pessoais]
    O --> O1[Query: Estat. Pessoais]
    O1[/"SELECT * FROM user_stats
    WHERE user_id = ?"/]
    H --> P[Ranking Global]
    P --> P1[Query: Ranking Global]
    P1[/"SELECT u.username, us.rank_points
    FROM user_stats us
    JOIN users u ON us.user_id = u.user_id
    ORDER BY us.rank_points DESC
    LIMIT 100"/]
    N --> R[Partidas do Torneio]
    R --> R1[Query: Partidas Torneio]
    R1[/"SELECT * FROM matches
    WHERE tournament_id = ?"/]
    R --> S[Resultado Final do Torneio]
    S --> S1[Query: Finalizar Torneio]
    S1[/"UPDATE tournaments
    SET end_date = CURRENT_DATE
    WHERE tournament_id = ?"/]
    Q --> E
    S --> E
    T --> X[Editar Perfil]
    X --> X1[Query: Atualizar Perfil]
    X1[/"UPDATE user_profiles
    SET display_name = ?, avatar_url = ?, bio = ?
    WHERE user_id = ?"/]
    T --> Y[Histórico de Partidas]
    Y --> Y1[Query: Histórico]
    Y1[/"SELECT m.match_id, m.start_time, m.end_time,
    mp.score, gm.mode_name
    FROM matches m
    JOIN match_participants mp ON m.match_id = mp.match_id
    JOIN game_modes gm ON m.mode_id = gm.mode_id
    WHERE mp.user_id = ?
    ORDER BY m.start_time DESC"/]
```
