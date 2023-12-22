# state machine pattern to track transitions

class State(Base):
    __tablename__ = 'state'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    timestamp = Column(DateTime)


class SampleState(Base):
    __tablename__ = 'sample_state'
    sample_id = Column(Integer, ForeignKey('sample.id'), primary_key=True)
    state_id = Column(Integer, ForeignKey('state.id'), primary_key=True)
    sample = relationship('Sample', back_populates='states')
    state = relationship('State')


class Sample(Base):
    __tablename__ = 'sample'
    id = Column(Integer, primary_key=True)
    # ... other fields ...
    states = relationship('SampleState', back_populates='sample')

    @property
    def status(self):
        return self.session.query(SampleState).join(State).filter(SampleState.sample_id == self.id).order_by(
            State.timestamp.desc()).first().state

  def transition(self, action):
       # Define the valid actions for each state
       valid_actions = {
           'received': ['submit', 'cancel'],
           'submitted': ['verify'],
           'verified': ['publish', 'invalidate'],
           'cancelled': ['receive']
       }

       # Get the current state
       current_state = self.current_state

       # Check if the action is valid for the current state
       if action not in valid_actions[current_state]:
           raise Exception(f"Cannot transition from {current_state} to {action}")

       # If the action is valid, perform the transition
       new_state = session.query(State).filter(State.name == action).first()
       if new_state:
           sample_state = SampleState(sample_id=self.id, state_id=new_state.id)
           session.add(sample_state)
           session.commit()

