import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Xarrow from 'react-xarrows';

export default function Canvas() {
    const [cards, setCards] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [connections, setConnections] = useState([]);
    const [selectedForConnection, setSelectedForConnection] = useState({ start: null, end: null });

    const addCard = () => {
        const newCard = {
            id: `card-${cards.length + 1}`,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            position: { x: 0, y: 0 }
        };
        setCards([...cards, newCard]);
    };

    const handleOpen = (card) => {
        setSelectedCard(card);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCard(null);
    };

    const handleTextChange = (e) => {
        const updatedCard = { ...selectedCard, text: e.target.value };
        setSelectedCard(updatedCard);

        setCards((prevCards) =>
            prevCards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
            )
        );
    };

    const selectCardForConnection = (cardId) => {
        if (selectedForConnection.start === cardId) {
            setSelectedForConnection({ ...selectedForConnection, start: null });
        } else if (selectedForConnection.end === cardId) {
            setSelectedForConnection({ ...selectedForConnection, end: null });
        } else if (!selectedForConnection.start) {
            setSelectedForConnection({ ...selectedForConnection, start: cardId });
        } else if (!selectedForConnection.end) {
            setSelectedForConnection({ ...selectedForConnection, end: cardId });
        }
    };

    const addConnection = () => {
        if (selectedForConnection.start && selectedForConnection.end) {
            setConnections([...connections, selectedForConnection]);
            setSelectedForConnection({ start: null, end: null });
        }
    };

    const renderCardText = (card) => {
        const halfText = card.text.substring(0, Math.floor(card.text.length / 2));
        return (
            <Rnd
                default={{
                    x: card.position.x,
                    y: card.position.y,
                    width: 320,
                    height: 200,
                }}
                minWidth={150}
                minHeight={100}
                onDragStop={(e, d) => {
                    setCards(prevCards =>
                        prevCards.map(c =>
                            c.id === card.id ? { ...c, position: { x: d.x, y: d.y } } : c
                        )
                    );
                }}
                resizeHandleClasses={{ bottomRight: 'resize-handle' }}
            >
                <div
                    id={card.id}
                    onClick={() => selectCardForConnection(card.id)}
                    style={{ cursor: 'pointer', border: selectedForConnection.start === card.id || selectedForConnection.end === card.id ? '2px solid blue' : 'none' }}
                >
                    <Card variant="outlined" style={{ width: '100%', height: '100%' }}>
                        <CardContent>
                            {halfText}...
                            <Button variant="contained" onClick={() => handleOpen(card)}>Show More</Button>
                        </CardContent>
                    </Card>
                </div>
            </Rnd>
        );
    };

    return (
        <div className="canvas-container" style={{ height: '100vh', width: '100%', position: 'relative' }}>
            <Button variant="contained" onClick={addCard}>Add Card</Button>
            <Button variant="contained" color="primary" onClick={addConnection} disabled={!selectedForConnection.start || !selectedForConnection.end}>
                Connect Selected Cards
            </Button>
            <div className="canvas">
                {cards.map((card) => (
                    <div key={card.id} className="card" style={{ position: 'absolute', left: card.position.x, top: card.position.y }}>
                        {renderCardText(card)}
                    </div>
                ))}
                {connections.map((conn, index) => (
                    <Xarrow
                        key={index}
                        start={conn.start}
                        end={conn.end}
                        strokeWidth={2}
                        color="red"
                    />
                ))}
            </div>

            {selectedCard && (
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Card Text</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Card Text"
                            type="text"
                            fullWidth
                            multiline
                            value={selectedCard.text}
                            onChange={handleTextChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={handleClose} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}
