class Debouncer:
    def __init__(self, limit):
        self.limit = limit
        self.counter = 0
        self.last_value = None

    def __call__(self, fn, value='', *args, **kwargs):
        if value == self.last_value:
            self.counter += 1
        else:
            self.counter = 1
            self.last_value = value

        if self.counter >= self.limit:
            self.counter = 0
            return fn(*args, **kwargs)
