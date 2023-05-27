import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AbstractComponent from "../AbstractComponent";
import EdgeModal from "./EdgeModal";
import NodeModal from "./NodeModal";
import NodeItem from "./NodeItem";
import EdgeItem from "./EdgeItem";
import Node from "../../cytoscape/Node";
import Edge from "../../cytoscape/Edge";

class GraphEditor extends AbstractComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      availableTargetNodes: [],
      edges: [],
      showNodeModal: false,
      showEdgeModal: false,
      newNodeName: '',
      selectedSourceNode: null,
      selectedTargetNode: null,
    };
  }

  handleShowNodeModal = () => {
    this.setState({ showNodeModal: true });
  };

  handleHideNodeModal = () => {
    this.setState({ showNodeModal: false, newNodeName: '' });
  };

  handleAddNode = (newNodeName) => {
    const { nodes } = this.state;
    if (newNodeName.trim() === '') {
      toast.error('Ошибка: Необходимо указать имя узла.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const existingNode = nodes.find((node) => node.getLabel() === newNodeName);
    if (existingNode) {
      toast.error('Ошибка: Узел с таким именем уже существует.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const newNode: Node = new Node(uuidv4(), newNodeName);
    this.setState((prevState) => ({
      nodes: [...prevState.nodes, newNode],
      newNodeName: '',
      showNodeModal: false,
    }));
  };

  handleDeleteNode = (node) => {
    this.setState((prevState) => {
      const { nodes, edges } = prevState;

      // Удаление связанных ребер
      const updatedEdges = edges.filter(
          (edge) => edge.getSource().getId() !== node.getId() && edge.getTarget().getId() !== node.getId()
      );

      // Удаление узла
      const updatedNodes = nodes.filter((node) => node.getId() !== node.getId());

      return { nodes: updatedNodes, edges: updatedEdges };
    });
  };

  handleRenameNode = (nodeId, newName) => {
    const { nodes } = this.state;
    const existingNode = nodes.find((node) => node.getLabel() === newName);

    if (existingNode) {
      toast.error('Ошибка: Узел с таким именем уже существует.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } else {
      this.setState((prevState) => {
        const updatedNodes = prevState.nodes.map((node) => {
          if (node.getId() === nodeId) {
            return new Node(node.getId(), newName);
          }
          return node;
        });

        return { nodes: updatedNodes };
      });
    }
  };

  handleShowEdgeModal = () => {
    const { nodes } = this.state;
    if (nodes.length < 1) {
      toast.error('Ошибка: Для создания ребра необходимо добавить как минимум один узел.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    this.setState({ showEdgeModal: true });
  };

  handleHideEdgeModal = () => {
    this.setState({ showEdgeModal: false, selectedSourceNode: null, selectedTargetNode: null });
  };

  handleSelectSourceNode = (nodeId) => {
    const { nodes, edges } = this.state;
    const selectedNode = nodes.find((node) => node.getId() === nodeId);
    const availableTargetNodes = nodes.filter(
        (node) =>
            !edges.some(
                (edge) => edge.getSource().getId() === nodeId && edge.getTarget().getId() === node.getId()
            )
    );

    this.setState({ selectedSourceNode: selectedNode, availableTargetNodes });
  };

  handleSelectTargetNode = (nodeId) => {
    const { nodes } = this.state;
    const selectedNode = nodes.find((node) => node.getId() === nodeId);
    this.setState({ selectedTargetNode: selectedNode });
  };

  handleAddEdge = (selectedSourceNode, selectedTargetNode) => {
    const { edges } = this.state;
    if (!selectedSourceNode || !selectedTargetNode) return;

    const existingEdge = edges.find(
        (edge) =>
            edge.getSource().getId() === selectedSourceNode.getId() &&
            edge.getTarget().getId() === selectedTargetNode.getId()
    );

    if (existingEdge) {
      toast.error('Ошибка: Ребро уже существует.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const newEdge = new Edge(selectedSourceNode, selectedTargetNode);
    this.setState((prevState) => ({
      edges: [...prevState.edges, newEdge],
      selectedSourceNode: null,
      selectedTargetNode: null,
      showEdgeModal: false,
    }));
  };

  handleDeleteEdge = (edgeId) => {
    this.setState((prevState) => {
      const updatedEdges = prevState.edges.filter((edge) => edge.getId() !== edgeId);
      return { edges: updatedEdges };
    });
  };

  handleShowRenameModal = (nodeId) => {
    const { nodes } = this.state;
    const selectedNode = nodes.find((node) => node.getId() === nodeId);
    this.setState({ showRenameModal: true, selectedNode });
  };

  render() {
    const { nodes, edges, showNodeModal, showEdgeModal } = this.state;

    const t = this.props.t;

    return (
        <div className="graph-editor">
          <h1>{t('graph-editor.title')}</h1>

          <section>
            <h2>{t('graph-editor.nodeSectionTitle')}</h2>
            <Button variant="primary" onClick={this.handleShowNodeModal}>
              {t('graph-editor.addNodeButton')}
            </Button>
            <NodeModal
                show={showNodeModal}
                onHide={this.handleHideNodeModal}
                onAddNode={this.handleAddNode}
            />
            {nodes.map((node) => (
                <NodeItem
                    key={node.id}
                    node={node}
                    onDeleteNode={this.handleDeleteNode}
                    onRenameNode={this.handleRenameNode}
                />
            ))}
          </section>

          <section>
            <h2>{t('graph-editor.edgeSectionTitle')}</h2>
            <Button variant="primary" onClick={this.handleShowEdgeModal}>
              {t('graph-editor.addEdgeButton')}
            </Button>
            <EdgeModal
                show={showEdgeModal}
                onHide={this.handleHideEdgeModal}
                onAddEdge={this.handleAddEdge}
                nodes={nodes}
            />
            {edges.map((edge) => (
                <EdgeItem key={edge.id} edge={edge} onDeleteEdge={this.handleDeleteEdge} />
            ))}
          </section>
        </div>
    );
  }

}

export default withTranslation()(GraphEditor);
